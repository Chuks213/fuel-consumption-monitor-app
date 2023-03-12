// import * as React from "react";
// import { View, Text, TouchableOpacity, ToastAndroid, Platform, Alert, PermissionsAndroid } from "react-native";
// import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
// import haversine from "haversine";
// import Geolocation from 'react-native-geolocation-service';
// import styles from "../styles/map_css";
// import Colors from "../styles/Colors";
// import { AuthContext } from "../Main";
// import { doGet, doPost } from "../networking/ApiHelper";
// import { endTripUrl, recordTripInformationUrl } from "../networking/Routes";
// import Loader from "./Loader";
// import { storeItem, removeItem, retriveItem } from "../data/Storage";
// import KeepAwake from 'react-native-keep-awake';


// const LATITUDE_DELTA = 0.008;
// const LONGITUDE_DELTA = 0.008;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;
// const runningTripKey = "tp-running-ky";

// const Map = (props) => {
//     const { route, navigation } = props;
//     const { coOrdinates, updateInterval, userDefinedInterval, userDefinedMetric } = route.params || {};

//     const { performTripAction, isRefuel } = React.useContext(AuthContext);
//     let customMarker = React.useRef(null);
//     let timeout = null;
//     let updateIntervalC = null;

//     const [position, setPosition] = React.useState({
//         timestamp: null,
//         coords: {
//             latitude: 0,
//             longitude: 0,
//             altitude: 0,
//             speed: 0
//         }
//     });

//     const [coordinate, setCoordinate] = React.useState({
//         latitude: coOrdinates ? coOrdinates.latitude || LATITUDE : LATITUDE,
//         longitude: coOrdinates ? coOrdinates.longitude || LONGITUDE : LONGITUDE,
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA
//     });

//     const [state, setState] = React.useState({
//         locationPermissionGranted: false,
//         speed: 0,
//         altitude: 0,
//         distanceTravelled: 0,
//         initTest: 0
//     });

//     const [showLoader, setShowLoader] = React.useState(false);

//     const [initLatitude, setInitLatitude] = React.useState(0);
//     const [initLongitude, setInitLongitude] = React.useState(0);
//     const [jobRunning, setJobRunning] = React.useState(false);

//     const calculateSpeedInKmPerHour = (distanceInKm, t1, t2) => {
//         const time_s = (t2 - t1) / 1000.0;
//         const speed_kmps = distanceInKm / time_s;
//         return ((speed_kmps * 3600.0) / 1000.0) || 0;
//     }

//     React.useEffect(() => {
//         requestLocationPermission();
//     }, []);

//     React.useEffect(() => {
//         if (isRefuel) {
//             doGet(endTripUrl).then(record => {
//                 changeKeepAwake(false);
//                 if (record.responseCode == 99) {
//                     navigation.replace("Main", { startRefuel: true });
//                 } else {
//                     displayNotification(record.errorMessage);
//                 }
//             }).catch(err => {
//                 displayNotification("An error occurred while trying to end trip. Please check your internet connection and try again later");
//                 console.log("An error occurred: " + err);
//             });
//         }
//     }, [isRefuel]);

//     React.useLayoutEffect(() => {
//         return () => {
//             if (timeout) {
//                 clearTimeout(timeout);
//                 timeout = null;
//             }

//             if (updateIntervalC) {
//                 clearInterval(updateIntervalC);
//                 updateIntervalC = null;
//             }
//         }
//     }, []);

//     React.useEffect(() => {
//         if (state.locationPermissionGranted) {
//             try {
//                 reCalibrate();
//             } catch (err) {
//                 console.log("Geolocation error: ", err);
//             }
//         }
//     }, [state.locationPermissionGranted]);

//     const reCalibrate = () => {
//         Geolocation.getCurrentPosition(pos => {
//             const { latitude, longitude, speed, altitude } = pos.coords;

//             if (initLatitude == 0 && initLongitude == 0) {
//                 setInitLatitude(latitude);
//                 setInitLongitude(longitude);
//             }

//             const distanceTravelled = calcDistance({ latitude, longitude });
//             const movingSpeed = calculateSpeedInKmPerHour(distanceTravelled, position.timestamp, pos.timestamp);

//             console.log("Prev state: ", state);
//             setState({
//                 ...state,
//                 speed: movingSpeed,
//                 altitude: altitude,
//                 distanceTravelled: distanceTravelled
//             });

//             setCoordinate({ ...coordinate, latitude: latitude, longitude: longitude });

//             if (Platform.OS === "android") {
//                 if (customMarker) {
//                     customMarker.current.animateMarkerToCoordinate(
//                         { latitude: latitude, longitude: longitude },
//                         50
//                     );
//                 }
//             } else {
//                 coordinate.timing({ latitude: latitude, longitude: longitude }).start();
//             }

//             setPosition({ timestamp: pos.timestamp, coords: { ...pos.coords } });

//             try {
//                 getAndUpdateAdditionalDetails(pos, movingSpeed, altitude, distanceTravelled);
//                 if (!jobRunning) {
//                     setJobRunning(true);
//                 }
//             } catch (err) {
//                 console.log("Error fetching additional details: " + err);
//             }
//         },
//             (error) => {
//                 console.log("Get position error: ", error);
//             },
//             {
//                 enableHighAccuracy: true,
//                 // timeout: 20000,
//                 // maximumAge: 10000
//                 timeout: 5000,
//                 maximumAge: 2000
//             });
//     }

//     const getAndUpdateAdditionalDetails = async (e, speed, altitude, distanceTravelled) => {
//         let lat = e.coords.latitude;
//         let lon = e.coords.longitude;

//         let trafficRate = await getTrafficCondition({ latitude: lat, longitude: lon });
//         let roadAttributes = await getRoadAttributes({ latitude: lat, longitude: lon });

//         let isDataFetched = roadAttributes.roadName ? true : false;
//         let counter = 0;

//         while (!isDataFetched) {
//             console.log("Counter: ", counter);
//             if (counter == 5) {
//                 isDataFetched = true;
//                 break;
//             }
//             if (roadAttributes) {
//                 if (roadAttributes.roadName) {
//                     if (roadAttributes.roadName.trim() != "") {
//                         isDataFetched = true;
//                     }
//                 }
//             }
//             roadAttributes = await getRoadAttributes({ latitude: lat, longitude: lon });
//             counter++;
//         }

//         const tripInformationData = {
//             roadName: roadAttributes.roadName ? roadAttributes.roadName : (roadAttributes.alternativeRoadName || "N/A"),
//             latitude: lat,
//             longitude: lon,
//             isHighway: roadAttributes.isHighway || false,
//             isCrossing: roadAttributes.isCrossing || false,
//             isRailway: roadAttributes.isRailway || false,
//             speedLimit: roadAttributes.maxSpeed || 0,
//             isRoundAbout: roadAttributes.isRoundAbout || false,
//             isIntersection: roadAttributes.isIntersection || false,
//             isBusStop: roadAttributes.isBusStop || false,
//             realTimeTraffic: trafficRate,
//             movingSpeed: speed,
//             distanceTravelled: distanceTravelled,
//             laneInformation: roadAttributes.lanes || "N/A",
//             altitude: altitude
//         }

//         try {
//             const tripData = await retriveItem(runningTripKey);
//             let userTripData = [];
//             if (tripData) {
//                 userTripData = [...JSON.parse(tripData)];
//             }
//             userTripData.push(tripInformationData);
//             await storeItem(runningTripKey, userTripData, true);
//         } catch (err) {
//             console.log("Error updating async storage: ", err);
//         }
//     }

//     React.useEffect(() => {
//         if (jobRunning && updateInterval != "NEVER") {
//             let interval = (60 * 2 * 1000);

//             if (updateInterval == "EVERY_10_MINS") {
//                 interval = (60 * 10 * 1000);
//             } else if (updateInterval == "EVERY_20_MINS") {
//                 interval = (60 * 20 * 1000);
//             } else if (updateInterval == "USER_DEFINED") {
//                 if (userDefinedMetric == "MINS") {
//                     interval = (60 * (+userDefinedInterval) * 1000);
//                 } else if (userDefinedMetric == "HOURS") {
//                     interval = (60 * (60 * (+userDefinedInterval)) * 1000);
//                 }
//             }


//             updateIntervalC = setInterval(() => {
//                 const bootstrapAsync = async () => {
//                     try {
//                         let tripList = await retriveItem(runningTripKey);
//                         if (tripList) {
//                             let tripData = [...JSON.parse(tripList)];

//                             for (let i = 0; i < tripData.length; i++) {
//                                 await doPost(recordTripInformationUrl, tripData[i]);
//                             }

//                             await removeItem(runningTripKey);
//                         }
//                     } catch (err) {
//                         console.log("An error occurred while trying to update server: ", err);
//                     }
//                 }

//                 bootstrapAsync();
//             }, interval);
//         }
//     }, [jobRunning]);

//     React.useEffect(() => {
//         // let tt = setTimeout(() => {
//         //     reCalibrate();
//         // }, 30000);
//         let tt = setTimeout(() => {
//             reCalibrate();
//         }, 3000);

//         timeout = tt;

//         return () => {
//             if (tt) {
//                 clearTimeout(tt);
//                 tt = null;
//             }
//         }
//         // }, [position.timestamp]);
//     }, [position]);
    

//     const getTrafficCondition = async (coOrdinate) => {
//         let xCoOrdinate = coOrdinate.latitude;
//         let yCoOrdinate = coOrdinate.longitude;
//         const zoom = 16;
//         // const zoom = 11;
//         console.log(`Co-ordinates are: ${xCoOrdinate}, ${yCoOrdinate}`);
//         let trafficDataResponse = await doGet(`https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/${zoom}/json?point=${xCoOrdinate}%2C${yCoOrdinate}&unit=KMPH&openLr=false&key=VPXA1ShR3jH5MAcrcCAxElAiSIPz7XnK`);
//         if (trafficDataResponse) {
//             const { flowSegmentData } = trafficDataResponse;
//             if (flowSegmentData) {
//                 const { currentSpeed, freeFlowSpeed } = flowSegmentData;
//                 console.log("Traffic info: CS => " + currentSpeed + " FFS => " + freeFlowSpeed);
//                 const realTimeTraffic = currentSpeed / freeFlowSpeed;

//                 return realTimeTraffic;
//             }
//         }

//         return null;
//     }

//     const getRoadAttributes = async (coOrdinate) => {
//         let xCoOrdinate = coOrdinate.latitude;
//         let yCoOrdinate = coOrdinate.longitude;

//         const osmId = await getOsmId(xCoOrdinate, yCoOrdinate);
//         console.log("OSM Gotten: ", osmId);
//         let roadAttributeData = {
//             roadName: null,
//             isHighway: null,
//             isCrossing: null,
//             isRailway: null,
//             maxSpeed: null,
//             lanes: null,
//             isRoundAbout: false,
//             isIntersection: false,
//             isBusStop: false,
//             alternativeRoadName: osmId.alternativeName
//         }
//         let roadAttributesResponse = await doGet(`https://overpass-api.de/api/interpreter?data=[out:json];way(${osmId.id});(._;>;);out tags;`);
//         console.log("RAR: ", roadAttributesResponse);
//         if (roadAttributesResponse) {
//             if (roadAttributesResponse.elements) {
//                 if (roadAttributesResponse.elements.length > 0) {
//                     let elementWithTags = roadAttributesResponse.elements.filter(elem => {
//                         return elem["tags"];
//                     });

//                     for (let i = 0; i < elementWithTags.length; i++) {
//                         let element = elementWithTags[i];

//                         console.log("Tags: ", element);

//                         let roadName = element.tags.name;
//                         let isHighway = "highway" in element.tags;
//                         let isCrossing = "crossing" in element.tags;
//                         let isRailway = "railway" in element.tags;
//                         let maxSpeed = element.tags.maxspeed;
//                         let lanes = element.tags.lanes;

//                         console.log(`Road Name: ${roadName}, isHighway: ${isHighway}, isCrossing: ${isCrossing}, isRailWay: ${isRailway}, maxSpeed: ${maxSpeed}, lanes: ${lanes}`);
//                         roadAttributeData.roadName = roadName;
//                         if (!roadAttributeData.isHighway && isHighway)
//                             roadAttributeData.isHighway = isHighway;
//                         if (!roadAttributeData.isCrossing && isCrossing)
//                             roadAttributeData.isCrossing = isCrossing;
//                         if (!roadAttributeData.isRailway && isRailway)
//                             roadAttributeData.isRailway = isRailway;
//                         roadAttributeData.maxSpeed = maxSpeed;
//                         roadAttributeData.lanes = lanes;
//                         roadAttributeData.isIntersection = isCrossing;
//                         if (isHighway) {
//                             if (element.tags.highway == "bus_stop")
//                                 roadAttributeData.isBusStop = true;
//                         }
//                     }
//                 }
//             }
//         }

//         return roadAttributeData;
//     }

//     const getOsmId = async (xCoOrdinate, yCoOrdinate) => {
//         // const zoom = 12;
//         const zoom = 16;
//         // const zoom = 11;// More accurate...
//         let nominatimResponse = await doGet(`https://nominatim.geocoding.ai/reverse?lat=${xCoOrdinate}&lon=${yCoOrdinate}&zoom=${zoom}&format=jsonv2`);
//         if (nominatimResponse) {
//             const { osm_id, name } = nominatimResponse;
//             console.log("OSM-ID: " + osm_id);
//             return { id: osm_id, alternativeName: name };
//         }

//         return 0;
//     }

//     const requestLocationPermission = async () => {
//         try {
//             if (Platform.OS === 'android') {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                     {
//                         'title': 'App Location Permission',
//                         'message': 'Fuel consumption monitor app needs access to your map so you can be navigated.'
//                     }
//                 );
//                 if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                     console.log("Location access has been allowed on the device");
//                     setState({ ...state, locationPermissionGranted: true });
//                     changeKeepAwake(true);
//                     return true;
//                 } else {
//                     console.log("Location access has been disallowed on the device");
//                     setState({ ...state, locationPermissionGranted: false });
//                     return false;
//                 }
//             } else {
//                 setState({ ...state, locationPermissionGranted: true });
//                 return true;
//             }
//         } catch (err) {
//             console.warn(err);
//             console.log("An error occurred while trying to permit location on the device");
//         }

//     }

//     const getMapRegion = () => ({
//         latitude: coordinate.latitude,
//         longitude: coordinate.longitude,
//         latitudeDelta: coordinate.latitudeDelta,
//         longitudeDelta: coordinate.longitudeDelta
//     });

//     const calcDistance = (newLatLng) => {
//         if (initLatitude == 0 && initLongitude == 0) return 0;
//         return haversine({ latitude: initLatitude, longitude: initLongitude }, newLatLng) || 0;
//     };

//     const displayNotification = (message, forceNative) => {
//         if (!forceNative) {
//             if (Platform.OS === 'android') {
//                 ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
//             } else {
//                 Alert.alert(message);
//             }
//         } else {
//             Alert.alert("Fuel Consumed", message);
//         }
//     }

//     const endTrip = () => {
//         const bootstrapAsync = async () => {
//             setShowLoader(true);
//             doGet(endTripUrl).then(record => {
//                 setShowLoader(false);
//                 changeKeepAwake(false);
//                 if (record.responseCode == 99) {

//                     const asyncCall = async () => {
//                         try {
//                             let tripList = await retriveItem(runningTripKey);
//                             if (tripList) {
//                                 displayNotification("Sending update");
//                                 let tripData = [...JSON.parse(tripList)];

//                                 for (let i = 0; i < tripData.length; i++) {
//                                     await doPost(recordTripInformationUrl, tripData[i]);
//                                 }

//                                 await removeItem(runningTripKey);
//                             }
//                         } catch (err) {
//                             console.log("An error occurred while trying to update server: ", err);
//                         }
//                     }

//                     if(updateInterval != "NEVER")
//                         asyncCall();

//                     performTripAction("END");
//                     // const avgVehicleConsumptionPerLtr = 8.2;
//                     // const fuelConsumed = (avgVehicleConsumptionPerLtr * state.distanceTravelled) / 100;
//                     // displayNotification(`${parseFloat(fuelConsumed).toFixed(2) || 0} litres`, true);
//                     navigation.replace("Main");
//                 } else {
//                     displayNotification(record.errorMessage);
//                 }
//             }).catch(err => {
//                 setShowLoader(false);
//                 displayNotification("An error occurred while trying to end trip. Please check your internet connection and try again later");
//                 console.log("An error occurred: " + err);
//             });
//         }

//         bootstrapAsync();

//         if (timeout) {
//             clearTimeout(timeout);
//             timeout = null;
//         }

//         if (updateIntervalC) {
//             clearInterval(updateIntervalC);
//             updateIntervalC = null;
//         }
//     }

//     const changeKeepAwake = (shouldBeAwake) => {
//         if (shouldBeAwake) {
//             KeepAwake.activate();
//         } else {
//             KeepAwake.deactivate();
//         }
//     }

//     return (
//         <View style={styles.container}>
//             <MapView
//                 style={styles.map}
//                 // provider={PROVIDER_GOOGLE}
//                 showUserLocation
//                 followUserLocation
//                 zoomEnabled
//                 loadingEnabled
//                 region={getMapRegion()}
//             >
//                 <Marker.Animated ref={customMarker} coordinate={coordinate} />
//             </MapView>
//             <View style={[styles.buttonContainer]}>
//                 <View style={[styles.bubble, styles.button]}>
//                     <Text style={styles.bottomBarContent}>
//                         Distance: {parseFloat(state.distanceTravelled).toFixed(2)} km
//                     </Text>

//                     <Text style={styles.bottomBarContent}>
//                         Speed: {parseFloat(state.speed).toFixed(2)} km/h
//                     </Text>

//                     <TouchableOpacity onPress={() => endTrip()}>
//                         <Text style={styles.btnDanger}>End Trip</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//             <Loader show={showLoader} />
//         </View>
//     );
// }

// export default Map;