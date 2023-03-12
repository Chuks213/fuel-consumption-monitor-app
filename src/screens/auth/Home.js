import * as React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ToastAndroid, Platform, Alert, SafeAreaView } from 'react-native';
import styles from '../../styles/home_css';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../Main';
import { startTripUrl, endTripUrl, getConfigurationUrl, getLastTripInformationUrl } from '../../networking/Routes';
import { doPost, doGet } from '../../networking/ApiHelper';
import Loader from '../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import { removeItem } from "../../data/Storage";


const latLngKey = "tp-lat-lng-ky";

const Home = (props) => {
    const { performTripAction, isTripActive, isRefuel } = React.useContext(AuthContext);
    const [state, setState] = React.useState({
        modalVisible: false,
        displayLargeMap: false,
        vehicleType: "",
        updateInterval: "",
        fuelLevel: "",
        fuelStatus: "",
        isLoading: false,
        latitude: 0,
        longitude: 0
    });

    const [refuelModalVisible, setRefuelModalVisible] = React.useState(false);

    const { route, navigation } = props;
    const { startRefuel } = route.params || {};

    React.useEffect(() => {
        const bootstrapAsync = async () => {
            if (!isRefuel) {
                const lastTripInformationRecord = await doGet(getLastTripInformationUrl);
                if (lastTripInformationRecord) {
                    if (lastTripInformationRecord.responseCode == 99) {
                        // Fetch Config...
                        let vType = "";
                        let uInterval = "";
                        let udInterval = "";
                        let udMetric = "";
                        const tripConfigResponse = await doGet(getConfigurationUrl);
                        if (tripConfigResponse) {
                            if (tripConfigResponse.responseCode == 99) {
                                vType = tripConfigResponse.responseData.vehicleType2;
                                uInterval = tripConfigResponse.responseData.updateInterval;
                                udInterval = tripConfigResponse.responseData.userDefinedInterval;
                                udMetric = tripConfigResponse.responseData.userDefinedMetric;
                            }
                        }

                        if (lastTripInformationRecord.responseData) {
                            const latitude = lastTripInformationRecord.responseData.latitude;
                            const longitude = lastTripInformationRecord.responseData.longitude;
                            let mapData = {
                                vehicleType: state.vehicleType,
                                updateInterval: uInterval,
                                coOrdinates: { latitude: +latitude, longitude: +longitude }
                            }
                            if (udInterval && udInterval.trim() != "") {
                                mapData.userDefinedInterval = udInterval;
                                mapData.userDefinedMetric = udMetric;
                            }
                            navigation.push("Map", mapData);
                        } else {
                            let mapData = {
                                vehicleType: state.vehicleType,
                                updateInterval: uInterval,
                                coOrdinates: { latitude: 37.78825, longitude: -122.4324 }
                            }
                            if (udInterval && udInterval.trim() != "") {
                                mapData.userDefinedInterval = udInterval;
                                mapData.userDefinedMetric = udMetric;
                            }
                            navigation.push("Map", mapData);
                        }
                        performTripAction("START");
                    }
                }
            }
        }

        bootstrapAsync();
    }, []);

    React.useEffect(() => {
        const bootstrapAsync = async () => {
            if (startRefuel) {
                console.log("Start refuel: ", startRefuel);
                setState({ ...state, isLoading: true });
                const tripConfigResponse = await doGet(getConfigurationUrl);
                if (tripConfigResponse) {
                    if (tripConfigResponse.responseCode == 99) {
                        setState({ ...state, isLoading: false, vehicleType: tripConfigResponse.responseData.vehicleType2 });
                        setRefuelModalVisible(true);
                    } else {
                        setState({ ...state, isLoading: false });
                        setRefuelModalVisible(true);
                    }
                } else {
                    setState({ ...state, isLoading: false });
                    setRefuelModalVisible(true);
                }
            }
        }

        bootstrapAsync();
    }, [startRefuel]);

    const setModalVisible = (action) => {
        setState({ ...state, modalVisible: action });
    }

    const startTrip = () => {
        // if (state.vehicleType.trim() == "" || state.fuelLevel.trim() == "") {
        //     displayNotification("Please fill all fields to continue");
        //     return;
        // }

        if (state.vehicleType.trim() == "") {
            displayNotification("Please fill all fields to continue");
            return;
        }

        setState({ ...state, modalVisible: false, isLoading: true });

        const bootstrapAsync = async () => {
            await removeItem(latLngKey);
            doPost(startTripUrl, {
                vehicleType: state.vehicleType.trim(),
                fuelLevel: state.fuelLevel.trim()
            }).then(record => {
                setState({ ...state, isLoading: false, modalVisible: false });
                if (record.responseCode == 99) {
                    performTripAction("START");
                    
                    let mapData = {
                        vehicleType: state.vehicleType,
                        updateInterval: state.updateInterval,
                    }
                    navigation.push("Map", mapData);
                } else {
                    displayNotification(record.errorMessage);
                }
            }).catch(err => {
                setState({ ...state, isLoading: false, modalVisible: false });
                displayNotification("An error occurred while trying to start trip. Please check your internet connection and try again later");
                console.log("An error occurred: " + err);
            });
        }

        bootstrapAsync();
    }

    const displayNotification = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } else {
            Alert.alert(message);
        }
    }

    const endTrip = () => {
        setState({ ...state, isLoading: true });
        const bootstrapAsync = async () => {
            doGet(endTripUrl).then(record => {
                setState({ ...state, isLoading: false });
                if (record.responseCode == 99) {
                    performTripAction("END");
                    navigation.push("Main");
                } else {
                    displayNotification(record.errorMessage);
                }
            }).catch(err => {
                setState({ ...state, isLoading: false });
                displayNotification("An error occurred while trying to end trip. Please check your internet connection and try again later");
                console.log("An error occurred: " + err);
            });
        }

        bootstrapAsync();
    }

    const beginTrip = async () => {
        setState({ ...state, isLoading: true });
        const tripConfigResponse = await doGet(getConfigurationUrl);
        if (tripConfigResponse) {
            if (tripConfigResponse.responseCode == 99) {
                setState({ ...state, isLoading: false, modalVisible: true, vehicleType: tripConfigResponse.responseData.vehicleType2, updateInterval: tripConfigResponse.responseData.updateInterval });
            } else {
                setState({ ...state, modalVisible: true, isLoading: false });
            }
        } else {
            setState({ ...state, modalVisible: true, isLoading: false });
        }
    }

    const refuel = () => {
        if (state.vehicleType.trim() == "" || state.fuelLevel.trim() == "" || state.fuelStatus.trim() == "") {
            displayNotification("Please fill all fields to continue");
            return;
        }

        setRefuelModalVisible(false);
        setState({ ...state, isLoading: true });

        const bootstrapAsync = async () => {
            const record = await doPost(startTripUrl, {
                vehicleType: state.vehicleType.trim(),
                fuelLevel: state.fuelLevel.trim(),
                isFuelFull: (state.fuelStatus == "YES")
            });
            if (record) {
                setRefuelModalVisible(false);
                setState({ ...state, isLoading: false });
                if (record.responseCode == 99) {
                    performTripAction("COMPLETE_REFUEL");
                    navigation.push("Map");
                } else {
                    displayNotification(record.errorMessage);
                }
            } else {
                setRefuelModalVisible(false);
                setState({ ...state, isLoading: false });
                displayNotification("An error occurred while trying to refuel. Please check your internet connection and try again later");
                console.log("An error occurred: " + err);
            }
        }

        bootstrapAsync();
    }

    return (
        <SafeAreaView style={styles.main}>{/* Do light and dark mode on this... */}
            <TouchableOpacity
                style={[styles.btnBg, !isTripActive ? styles.btnStart : null]}
                onPress={() => !isTripActive ? beginTrip() : endTrip()}
            >
                <Text style={styles.btnText}>{!isTripActive ? "Start Trip" : "End Trip"}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                box
                visible={state.modalVisible}
                onRequestClose={() => {
                    setState({ ...state, vehicleType: "", destination: "" });
                }}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Trip Information</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    setModalVisible(!state.modalVisible);
                                }}>
                                <FontAwesomeIcon icon={faTimes} size={18} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.hr}></View>
                        <View style={styles.modalBody}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Vehicle Type</Text>
                                <TextInput style={styles.textInput} placeholder='Enter vehicle make/type' onChangeText={(text) => { setState({ ...state, vehicleType: text }) }} value={state.vehicleType} />
                            </View>
                            {/* <View style={styles.formGroup}>
                                <Text style={styles.label}>Fuel Level</Text>
                                <TextInput style={styles.textInput} placeholder='Enter fuel level' onChangeText={(text) => { setState({ ...state, fuelLevel: text }) }} />
                            </View> */}
                            {/* <View style={styles.formGroup}>
                                <Text style={styles.label}>Destination</Text>
                                <TextInput style={styles.textInput} placeholder='Enter a valid destination' onChangeText={(text) => { setState({ ...state, destination: text }) }} />
                            </View> */}

                            <View style={styles.formGroup}>
                                <TouchableOpacity style={styles.button} onPress={() => startTrip()}>
                                    <Text style={styles.textWhite}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                box
                visible={refuelModalVisible}
                onRequestClose={() => {
                    setState({ ...state, vehicleType: "", fuelLevel: "", fuelStatus: "" });
                }}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                    <View style={[styles.modal, styles.modal50]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Trip Information</Text>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    setRefuelModalVisible(!state.refuelModalVisible);
                                }}>
                                <FontAwesomeIcon icon={faTimes} size={18} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.hr}></View>
                        <View style={styles.modalBody}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Vehicle Type</Text>
                                <TextInput style={styles.textInput} placeholder='Enter vehicle make/type' onChangeText={(text) => { setState({ ...state, vehicleType: text }) }} value={state.vehicleType} />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Quantity</Text>
                                <TextInput style={styles.textInput} placeholder='Enter quantity' onChangeText={(text) => { setState({ ...state, fuelLevel: text }) }} value={state.fuelLevel} />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Is Fuel Full</Text>
                                <View style={styles.select}>
                                    <Picker selectedValue={state.fuelStatus} style={styles.picker} onValueChange={(itemValue, itemIndex) => setState({ ...state, fuelStatus: itemValue })} >
                                        <Picker.Item label="Not Set" value="" />
                                        <Picker.Item label="Yes" value="YES" />
                                        <Picker.Item label="No" value="NO" />
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <TouchableOpacity style={styles.button} onPress={() => refuel()}>
                                    <Text style={styles.textWhite}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Loader show={state.isLoading} />
        </SafeAreaView>
    );
}

export default Home;