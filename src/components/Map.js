// import * as React from "react";
// import { View, Text, TouchableOpacity, ToastAndroid, Platform, Alert, PermissionsAndroid } from "react-native";
// import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
// import haversine from "haversine";
// // import Geolocation from 'react-native-geolocation-service';
// import Geolocation from "@react-native-community/geolocation";
// import styles from "../styles/map_css";
// import Colors from "../styles/Colors";
// import { AuthContext } from "../Main";
// import { doGet, doPost } from "../networking/ApiHelper";
// import { endTripUrl, recordTripInformationUrl } from "../networking/Routes";
// import Loader from "./Loader";


// const LATITUDE_DELTA = 0.009;
// const LONGITUDE_DELTA = 0.009;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;

// const Map = (props) => {
//     const { performTripAction } = React.useContext(AuthContext);
//     let customMarker = React.useRef(null);
//     let watchID = null;

//     const [coordinate, setCoordinate] = React.useState(new AnimatedRegion({
//         latitude: props.coOrdinate ? props.coOrdinates.latitude || LATITUDE : LATITUDE,
//         longitude: props.coOrdinate ? props.coOrdinates.longitude || LONGITUDE : LONGITUDE,
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA
//     }));

//     const [state, setState] = React.useState({
//         locationPermissionGranted: false,
//         latitude: props.coOrdinate ? props.coOrdinates.latitude || LATITUDE : LATITUDE,
//         longitude: props.coOrdinate ? props.coOrdinates.longitude || LONGITUDE : LONGITUDE,
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//         speed: 0,
//         routeCoordinates: [],
//         distanceTravelled: 0,
//         prevLatLng: {},
//         coordinate: new AnimatedRegion({
//             latitude: props.coOrdinate ? props.coOrdinates.latitude || LATITUDE : LATITUDE,
//             longitude: props.coOrdinate ? props.coOrdinates.longitude || LONGITUDE : LONGITUDE,
//             latitudeDelta: LATITUDE_DELTA,
//             longitudeDelta: LONGITUDE_DELTA
//         })
//     });

//     const [updateInterval, setUpdateInterval] = React.useState(props.updateInterval);

//     const [showLoader, setShowLoader] = React.useState(false);

//     // function calculateSpeed(t1, lat1, lng1, t2, lat2, lng2) {
//     //     // From Caspar Kleijne's answer starts
//     //     /** Converts numeric degrees to radians */
//     //     if (typeof(Number.prototype.toRad) === "undefined") {
//     //       Number.prototype.toRad = function() {
//     //         return this * Math.PI / 180;
//     //       }
//     //     }
//     //     // From Caspar Kleijne's answer ends
//     //     // From cletus' answer starts
//     //     var R = 6371; // km
//     //     var dLat = (lat2-lat1).toRad();
//     //     var dLon = (lon2-lon1).toRad();
//     //     var lat1 = lat1.toRad();
//     //     var lat2 = lat2.toRad();

//     //     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//     //       Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) *    Math.cos(lat2); 
//     //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//     //     var distance = R * c;
//     //     // From cletus' answer ends

//     //     return distance / t2 - t1;
//     //   }

//     //   function firstGeolocationSuccess(position1) {
//     //     var t1 = Date.now();
//     //     navigator.geolocation.getCurrentPosition(
//     //       function (position2) {
//     //         var speed = calculateSpeed(t1 / 1000, position1.coords.latitude, position1.coords.longitude, Date.now() / 1000, position2.coords.latitude, position2.coords.longitude);
//     //       }
//     //   }
//     //   navigator.geolocation.getCurrentPosition(firstGeolocationSuccess);

//     React.useEffect(() => {
//         requestLocationPermission();
//     }, []);

//     React.useLayoutEffect(() => {
//         return () => {
//             Geolocation.clearWatch(watchID);
//         }
//     }, []);

//     React.useEffect(() => {
//         // if (state.locationPermissionGranted) {
//         try {
//             const { coordinate } = state;
//             console.log("About watching...");
//             // Geolocation.getCurrentPosition(info => console.log(info));
//             // watchID = Geolocation.watchPosition(
//             //     position => {
//             //         console.log("Position: ", position);
//             //         displayNotification("position: "+ position.toString());
//             //         const { routeCoordinates, distanceTravelled } = state;
//             //         const { latitude, longitude, speed } = position.coords;

//             //         const newCoordinate = {
//             //             latitude,
//             //             longitude
//             //         };



//             //         const newRouteCoordinates = [...routeCoordinates];
//             //         if (newRouteCoordinates.filter(record => record.latitude == latitude && record.longitude == longitude).length == 0) {
//             //             console.log("No existing record");
//             //             // displayNotification("No existing record: "+ latitude + "--"+ longitude);

//             //             if (Platform.OS === "android") {
//             //                 if (customMarker) {
//             //                     customMarker.current.animateMarkerToCoordinate(
//             //                         newCoordinate,
//             //                         // 500
//             //                         1000
//             //                     );
//             //                 }
//             //             } else {
//             //                 coordinate.timing(newCoordinate).start();
//             //             }

//             //             newRouteCoordinates.push(newCoordinate);
//             //             // displayNotification("New distance: " + distanceTravelled + calcDistance(newCoordinate));
//             //             setTimeout(() => {
//             //                 setState({
//             //                     ...state,
//             //                     latitude: latitude,
//             //                     longitude: longitude,
//             //                     speed: speed,
//             //                     routeCoordinates: newRouteCoordinates,
//             //                     distanceTravelled: distanceTravelled + calcDistance(newCoordinate),
//             //                     prevLatLng: newCoordinate
//             //                 });
//             //             }, 800);// Update state after 800ms...
//             //         }
//             //     },
//             //     (error) => {
//             //         console.log("Watch position error: ", error)
//             //     },
//             //     {
//             //         // enableHighAccuracy: true,
//             //         enableHighAccuracy: true,
//             //         // timeout: 5000,
//             //         timeout: 20000,
//             //         maximumAge: 1000,
//             //         distanceFilter: 5
//             //         // distanceFilter: 10
//             //     }
//             // );

//             // Geolocation.getCurrentPosition(
//             //     position => {
//             //         const initialPosition = JSON.stringify(position);
//             //         //   this.setState({initialPosition});
//             //         const { latitude, longitude, speed } = position.coords;
//             //         setState({ ...state, latitude: latitude, longitude: longitude, speed: speed });
//             //         if (Platform.OS === "android") {
//             //             if (customMarker) {
//             //                 customMarker.current.animateMarkerToCoordinate(
//             //                     {latitude, longitude},
//             //                     // 500
//             //                     500
//             //                 );
//             //             }
//             //         } else {
//             //             coordinate.timing(newCoordinate).start();
//             //         }

//             //         displayNotification("CP -> IP: " + initialPosition);
//             //     },
//             //     error => Alert.alert('Error', JSON.stringify(error)),
//             //     { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
//             // );
//             watchID = Geolocation.watchPosition(position => {
//                 const lastPosition = JSON.stringify(position);
//                 // this.setState({lastPosition});
//                 const { latitude, longitude, speed } = position.coords;
//                 setState({ ...state, latitude: latitude, longitude: longitude, speed: speed });
//                 if (Platform.OS === "android") {
//                     if (customMarker) {
//                         customMarker.current.animateMarkerToCoordinate(
//                             {latitude, longitude, latitudeDelta: state.latitudeDelta, longitudeDelta: state.longitudeDelta},
//                             // 500
//                             500
//                         );
//                     }
//                 } else {
//                     coordinate.timing(newCoordinate).start();
//                 }
//                 displayNotification("WP -> IP: " + lastPosition);
//             },
//                 error => Alert.alert('Error', JSON.stringify(error)),
//                 { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000, distanceFilter: 0.5 });
//         } catch (err) {
//             console.log("Geolocation error: ", err);
//             displayNotification("Geolocation error");
//         }
//         // }
//     }, []);

//     // React.useEffect(() => {
//     //     if (state.locationPermissionGranted) {
//     //         try {
//     //             const { coordinate } = state;
//     //             console.log("About watching...");
//     //             // Geolocation.getCurrentPosition(info => console.log(info));
//     //             // watchID = Geolocation.watchPosition(
//     //             //     position => {
//     //             //         console.log("Position: ", position);
//     //             //         displayNotification("position: "+ position.toString());
//     //             //         const { routeCoordinates, distanceTravelled } = state;
//     //             //         const { latitude, longitude, speed } = position.coords;

//     //             //         const newCoordinate = {
//     //             //             latitude,
//     //             //             longitude
//     //             //         };



//     //             //         const newRouteCoordinates = [...routeCoordinates];
//     //             //         if (newRouteCoordinates.filter(record => record.latitude == latitude && record.longitude == longitude).length == 0) {
//     //             //             console.log("No existing record");
//     //             //             // displayNotification("No existing record: "+ latitude + "--"+ longitude);

//     //             //             if (Platform.OS === "android") {
//     //             //                 if (customMarker) {
//     //             //                     customMarker.current.animateMarkerToCoordinate(
//     //             //                         newCoordinate,
//     //             //                         // 500
//     //             //                         1000
//     //             //                     );
//     //             //                 }
//     //             //             } else {
//     //             //                 coordinate.timing(newCoordinate).start();
//     //             //             }

//     //             //             newRouteCoordinates.push(newCoordinate);
//     //             //             // displayNotification("New distance: " + distanceTravelled + calcDistance(newCoordinate));
//     //             //             setTimeout(() => {
//     //             //                 setState({
//     //             //                     ...state,
//     //             //                     latitude: latitude,
//     //             //                     longitude: longitude,
//     //             //                     speed: speed,
//     //             //                     routeCoordinates: newRouteCoordinates,
//     //             //                     distanceTravelled: distanceTravelled + calcDistance(newCoordinate),
//     //             //                     prevLatLng: newCoordinate
//     //             //                 });
//     //             //             }, 800);// Update state after 800ms...
//     //             //         }
//     //             //     },
//     //             //     (error) => {
//     //             //         console.log("Watch position error: ", error)
//     //             //     },
//     //             //     {
//     //             //         // enableHighAccuracy: true,
//     //             //         enableHighAccuracy: true,
//     //             //         // timeout: 5000,
//     //             //         timeout: 20000,
//     //             //         maximumAge: 1000,
//     //             //         distanceFilter: 5
//     //             //         // distanceFilter: 10
//     //             //     }
//     //             // );

//     //             Geolocation.getCurrentPosition(
//     //                 position => {
//     //                     const initialPosition = JSON.stringify(position);
//     //                     //   this.setState({initialPosition});
//     //                     displayNotification("IP: " + initialPosition);
//     //                 },
//     //                 error => Alert.alert('Error', JSON.stringify(error)),
//     //                 { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
//     //             );
//     //             watchID = Geolocation.watchPosition(position => {
//     //                 const lastPosition = JSON.stringify(position);
//     //                 // this.setState({lastPosition});
//     //                 displayNotification("IP: " + lastPosition);
//     //             },
//     //                 error => Alert.alert('Error', JSON.stringify(error)),
//     //                 { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 });
//     //         } catch (err) {
//     //             console.log("Geolocation error: ", err);
//     //             displayNotification("Geolocation error");
//     //         }
//     //     }
//     // }, [state.locationPermissionGranted]);

//     // React.useEffect(() => {
//     //     console.log("Co-ordinates length has changed..." + state.routeCoordinates.length);
//     //     // displayNotification("Co-ordinates length has changed..." + state.routeCoordinates.length);
//     //     console.log("Update Interval: " + updateInterval);
//     //     let interval;

//     //     if (updateInterval == "EVERY_10_MINS")
//     //         interval = (60 * 10 * 1000);
//     //     else if (updateInterval == "EVERY_20_MINS")
//     //         interval = (60 * 20 * 1000);

//     //     interval = (60 * 1000);// Every 1 min...

//     //     setTimeout(() => {
//     //         const bootstrapAsync = async () => {
//     //             if (interval) {
//     //                 displayNotification("Sending update to server now");

//     //                 let trafficRate = await getTrafficCondition({ latitude: state.latitude, longitude: state.longitude });
//     //                 let roadAttributes = await getRoadAttributes({ latitude: state.latitude, longitude: state.longitude });

//     //                 const recordTripInformationResponse = await doPost(recordTripInformationUrl, {
//     //                     roadName: roadAttributes.roadName,
//     //                     latitude: state.latitude,
//     //                     longitude: state.longitude,
//     //                     isHighway: roadAttributes.isHighway,
//     //                     isCrossing: roadAttributes.isCrossing,
//     //                     isRailway: roadAttributes.isRailway,
//     //                     speedLimit: roadAttributes.maxSpeed,
//     //                     realTimeTraffic: trafficRate,
//     //                     movingSpeed: state.speed,
//     //                     distanceTravelled: state.distanceTravelled,
//     //                     laneInformation: roadAttributes.lanes
//     //                 });

//     //                 console.log("Trip information response: ", recordTripInformationResponse);

//     //             }
//     //         }

//     //         bootstrapAsync();
//     //     }, interval);

//     // }, [state.routeCoordinates.length]);

//     const getTrafficCondition = async (coOrdinate) => {
//         let xCoOrdinate = coOrdinate.latitude;
//         let yCoOrdinate = coOrdinate.longitude;
//         // const zoom = 16;
//         const zoom = 11;
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
//         let roadAttributeData = {
//             roadName: null,
//             isHighway: null,
//             isCrossing: null,
//             isRailway: null,
//             maxSpeed: null,
//             lanes: null
//         }
//         let roadAttributesResponse = await doGet(`http://overpass-api.de/api/interpreter?data=[out:json];way(${osmId});(._;>;);out tags;`);
//         if (roadAttributesResponse) {
//             if (roadAttributesResponse.elements) {
//                 if (roadAttributesResponse.elements.length > 0) {
//                     let element = roadAttributesResponse.elements.filter(elem => {
//                         return elem["tags"];
//                     })[0];

//                     console.log("Tags: ", element);

//                     let roadName = element.tags.name;
//                     let isHighway = "highway" in element.tags;
//                     let isCrossing = "crossing" in element.tags;
//                     let isRailway = "railway" in element.tags;
//                     let maxSpeed = element.tags.maxspeed;
//                     let lanes = element.tags.lanes;

//                     console.log(`Road Name: ${roadName}, isHighway: ${isHighway}, isCrossing: ${isCrossing}, isRailWay: ${isRailway}, maxSpeed: ${maxSpeed}, lanes: ${lanes}`);
//                     roadAttributeData.roadName = roadName;
//                     roadAttributeData.isHighway = isHighway;
//                     roadAttributeData.isCrossing = isCrossing;
//                     roadAttributeData.isRailway = isRailway;
//                     roadAttributeData.maxSpeed = maxSpeed;
//                     roadAttributeData.lanes = lanes;

//                     return roadAttributeData;
//                 }
//             }
//         }

//         return null;
//     }

//     const getOsmId = async (xCoOrdinate, yCoOrdinate) => {
//         // const zoom = 16;
//         const zoom = 11;
//         let nominatimResponse = await doGet(`https://nominatim.geocoding.ai/reverse?lat=${xCoOrdinate}&lon=${yCoOrdinate}&zoom=${zoom}&format=jsonv2`);
//         if (nominatimResponse) {
//             const { osm_id } = nominatimResponse;
//             console.log("OSM-ID: " + osm_id);
//             // return 16369670;
//             return osm_id;
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
//                     return true;
//                 } else {
//                     console.log("Location access has been disallowed on the device");
//                     setState({ ...state, locationPermissionGranted: false });
//                     return false;
//                 }
//             }
//         } catch (err) {
//             console.warn(err);
//             console.log("An error occurred while trying to permit location on the device");
//         }

//     }

//     const getMapRegion = () => ({
//         latitude: state.latitude,
//         longitude: state.longitude,
//         latitudeDelta: state.latitudeDelta,
//         longitudeDelta: state.longitudeDelta
//     });

//     const calcDistance = (newLatLng) => {
//         const { prevLatLng } = state;
//         console.log("Prev LtLNG: ", prevLatLng);
//         console.log("New LtLNG: ", newLatLng);
//         return haversine(prevLatLng, newLatLng) || 0;
//     };

//     const displayNotification = (message) => {
//         if (Platform.OS === 'android') {
//             ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
//         } else {
//             Alert.alert(message);
//         }
//     }

//     const endTrip = () => {
//         const bootstrapAsync = async () => {
//             setShowLoader(true);
//             doGet(endTripUrl).then(record => {
//                 setShowLoader(false);
//                 if (record.responseCode == 99) {
//                     performTripAction("END");
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
//         Geolocation.clearWatch(watchID);
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
//                 <Polyline coordinates={state.routeCoordinates} strokeWidth={5} strokeColor={Colors.dark} fillColor={Colors.dark} />
//                 <Marker.Animated ref={customMarker} coordinate={coordinate} />
//             </MapView>
//             <View style={[styles.buttonContainer]}>
//                 <View style={[styles.bubble, styles.button]}>
//                     <Text style={styles.bottomBarContent}>
//                         Distance: {parseFloat(state.distanceTravelled).toFixed(2)} km
//                     </Text>

//                     <Text style={styles.bottomBarContent}>
//                         Speed: {parseFloat(state.speed).toFixed(2)} mph
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