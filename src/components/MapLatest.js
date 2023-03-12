import * as React from "react";
import { View, Text, TouchableOpacity, ToastAndroid, Platform, Alert, PermissionsAndroid } from "react-native";
import MapView, { Marker } from "react-native-maps";
import haversine from "haversine";
import Geolocation from 'react-native-geolocation-service';
import styles from "../styles/map_css";
import { AuthContext } from "../Main";
import { doGet, doPost } from "../networking/ApiHelper";
import { endTripUrl, recordBulkTripInformationUrl } from "../networking/Routes";
import Loader from "./Loader";
import { storeItem, removeItem, retriveItem } from "../data/Storage";
import KeepAwake from 'react-native-keep-awake';


const LATITUDE_DELTA = 0.008;
const LONGITUDE_DELTA = 0.008;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const latLngKey = "tp-lat-lng-ky";

const Map = (props) => {
    const { route, navigation } = props;
    const { coOrdinates, updateInterval, userDefinedInterval, userDefinedMetric } = route.params || {};

    const { performTripAction, isRefuel } = React.useContext(AuthContext);
    let customMarker = React.useRef(null);
    let timeout = null;
    let updateIntervalC = null;

    const [positionTimeStamp, setPositionTimeStamp] = React.useState(null);
    const [lastUpdateTime, setLastUpdateTime] = React.useState(null);

    const [coordinate, setCoordinate] = React.useState({
        latitude: coOrdinates ? coOrdinates.latitude || LATITUDE : LATITUDE,
        longitude: coOrdinates ? coOrdinates.longitude || LONGITUDE : LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });

    const [state, setState] = React.useState({
        locationPermissionGranted: false,
        speed: 0,
        altitude: 0,
        distanceTravelled: 0,
        initTest: 0
    });

    const [showLoader, setShowLoader] = React.useState(false);

    const [initLatitude, setInitLatitude] = React.useState(0);
    const [initLongitude, setInitLongitude] = React.useState(0);
    const [jobRunning, setJobRunning] = React.useState(false);

    const calculateSpeedInKmPerHour = (distanceInKm, t1, t2) => {
        const time_s = (t2 - t1) / 1000.0;
        const speed_kmps = distanceInKm / time_s;
        return ((speed_kmps * 3600.0) / 1000.0) || 0;
    }

    React.useEffect(() => {
        requestLocationPermission();
    }, []);

    React.useEffect(() => {
        if (isRefuel) {
            doGet(endTripUrl).then(record => {
                changeKeepAwake(false);
                if (record.responseCode == 99) {
                    navigation.replace("Main", { startRefuel: true });
                } else {
                    displayNotification(record.errorMessage);
                }
            }).catch(err => {
                displayNotification("An error occurred while trying to end trip. Please check your internet connection and try again later");
                console.log("An error occurred: " + err);
            });
        }
    }, [isRefuel]);

    React.useLayoutEffect(() => {
        return () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            if (updateIntervalC) {
                clearInterval(updateIntervalC);
                updateIntervalC = null;
            }
        }
    }, []);

    React.useEffect(() => {
        if (state.locationPermissionGranted) {
            try {
                reCalibrate();
            } catch (err) {
                console.log("Geolocation error: ", err);
            }
        }
    }, [state.locationPermissionGranted]);

    const reCalibrate = () => {
        Geolocation.getCurrentPosition(pos => {
            const { latitude, longitude, speed, altitude } = pos.coords;

            if (initLatitude == 0 && initLongitude == 0) {
                setInitLatitude(latitude);
                setInitLongitude(longitude);
            }

            const distanceTravelled = calcDistance({ latitude, longitude });
            const calculatedSpeed = calculateSpeedInKmPerHour(distanceTravelled, positionTimeStamp, pos.timestamp);
            const movingSpeed = Number.isFinite(calculatedSpeed) ? calculatedSpeed : 0;

            console.log("Prev state: ", state);
            setState({
                ...state,
                speed: movingSpeed,
                altitude: altitude,
                distanceTravelled: distanceTravelled
            });

            setCoordinate({ ...coordinate, latitude: latitude, longitude: longitude });

            if (Platform.OS === "android") {
                if (customMarker) {
                    customMarker.current.animateMarkerToCoordinate(
                        { latitude: latitude, longitude: longitude },
                        50
                    );
                }
            } else {
                coordinate.timing({ latitude: latitude, longitude: longitude }).start();
            }

            setPositionTimeStamp(pos.timestamp);
            setLastUpdateTime(new Date());

            const bootstrapAsync = async () => {
                try {
                    const tripData = await retriveItem(latLngKey);
                    let latLngData = [];
                    if (tripData) {
                        latLngData = [...JSON.parse(tripData)];
                    }

                    const fetchTime = pos.timestamp;

                    const data = {latitude, longitude, movingSpeed, altitude, distanceTravelled, fetchTime};
                    latLngData.push(data);
                    await storeItem(latLngKey, latLngData, true);

                    if (!jobRunning) setJobRunning(true);
                } catch (err) {
                    console.log("Error updating async storage: ", err);
                }
            }

            bootstrapAsync();
        },
            (error) => {
                console.log("Get position error: ", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 2000
            });
    }

    React.useEffect(() => {
        if (jobRunning && updateInterval != "NEVER") {
            let interval = (60 * 2 * 1000);

            if (updateInterval == "EVERY_10_MINS") {
                interval = (60 * 10 * 1000);
            } else if (updateInterval == "EVERY_20_MINS") {
                interval = (60 * 20 * 1000);
            } else if (updateInterval == "USER_DEFINED") {
                if (userDefinedMetric == "MINS") {
                    interval = (60 * (+userDefinedInterval) * 1000);
                } else if (userDefinedMetric == "HOURS") {
                    interval = (60 * (60 * (+userDefinedInterval)) * 1000);
                }
            }


            updateIntervalC = setInterval(() => {
                const bootstrapAsync = async () => {
                    try {
                        let latLngInfo = await retriveItem(latLngKey);
                        if (latLngInfo) {
                            let tripData = [...JSON.parse(latLngInfo)];
                            
                            await doPost(recordBulkTripInformationUrl, tripData);

                            await removeItem(latLngKey);
                        }
                    } catch (err) {
                        console.log("An error occurred while trying to update server: ", err);
                    }
                }

                bootstrapAsync();
            }, interval);
        }
    }, [jobRunning]);

    React.useEffect(() => {
        let tt = setTimeout(() => {
            reCalibrate();
        }, 1000);

        timeout = tt;

        return () => {
            if (tt) {
                clearTimeout(tt);
                tt = null;
            }
        }
    }, [lastUpdateTime]);

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'App Location Permission',
                        'message': 'Fuel consumption monitor app needs access to your map so you can be navigated.'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Location access has been allowed on the device");
                    setState({ ...state, locationPermissionGranted: true });
                    changeKeepAwake(true);
                    return true;
                } else {
                    console.log("Location access has been disallowed on the device");
                    setState({ ...state, locationPermissionGranted: false });
                    return false;
                }
            } else {
                setState({ ...state, locationPermissionGranted: true });
                return true;
            }
        } catch (err) {
            console.warn(err);
            console.log("An error occurred while trying to permit location on the device");
        }

    }

    const getMapRegion = () => ({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: coordinate.latitudeDelta,
        longitudeDelta: coordinate.longitudeDelta
    });

    const calcDistance = (newLatLng) => {
        if (initLatitude == 0 && initLongitude == 0) return 0;
        return haversine({ latitude: initLatitude, longitude: initLongitude }, newLatLng) || 0;
    };

    const displayNotification = (message, forceNative) => {
        if (!forceNative) {
            if (Platform.OS === 'android') {
                ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
            } else {
                Alert.alert(message);
            }
        } else {
            Alert.alert("Fuel Consumed", message);
        }
    }

    const endTrip = () => {
        const bootstrapAsync = async () => {
            if(!showLoader) setShowLoader(true);
            doGet(endTripUrl).then(record => {
                setShowLoader(false);
                changeKeepAwake(false);
                if (record.responseCode == 99) {
                    performTripAction("END");
                    navigation.replace("Main");
                } else {
                    displayNotification(record.errorMessage);
                }
            }).catch(err => {
                setShowLoader(false);
                displayNotification("An error occurred while trying to end trip. Please check your internet connection and try again later");
                console.log("An error occurred: " + err);
            });
        }

        const updateStoredData = async () => {
            setShowLoader(true);
            if(updateInterval && updateInterval != "NEVER") {
                try {
                    let latLngInfo = await retriveItem(latLngKey);
                    if (latLngInfo) {
                        displayNotification("Sending update");
                        let tripData = [...JSON.parse(latLngInfo)];

                        await doPost(recordBulkTripInformationUrl, tripData);

                        await removeItem(latLngKey);
                    }
                    bootstrapAsync();
                } catch (err) {
                    console.log("An error occurred while trying to update server: ", err);
                    bootstrapAsync();
                }
            }else {
                bootstrapAsync();
            }
        }

        updateStoredData();

        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        if (updateIntervalC) {
            clearInterval(updateIntervalC);
            updateIntervalC = null;
        }
    }

    const changeKeepAwake = (shouldBeAwake) => {
        if (shouldBeAwake) {
            KeepAwake.activate();
        } else {
            KeepAwake.deactivate();
        }
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                // provider={PROVIDER_GOOGLE}
                showUserLocation
                followUserLocation
                zoomEnabled
                loadingEnabled
                region={getMapRegion()}
            >
                <Marker.Animated ref={customMarker} coordinate={coordinate} />
            </MapView>
            <View style={[styles.buttonContainer]}>
                <View style={[styles.bubble, styles.button]}>
                    <Text style={styles.bottomBarContent}>
                        Distance: {parseFloat(state.distanceTravelled).toFixed(2)} km
                    </Text>

                    <Text style={styles.bottomBarContent}>
                        Speed: {parseFloat(state.speed).toFixed(2)} km/h
                    </Text>

                    <TouchableOpacity onPress={() => endTrip()}>
                        <Text style={styles.btnDanger}>End Trip</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Loader show={showLoader} />
        </View>
    );
}

export default Map;