import * as React from "react";
import { SafeAreaView, View, Text, TextInput, Switch, useColorScheme, Modal, ScrollView, TouchableOpacity } from "react-native";
import styles from "../../styles/settings_css";
import { Picker } from '@react-native-picker/picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import Colors from "../../styles/Colors";
import { getConfigurationUrl, updateConfigurationUrl } from '../../networking/Routes';
import { doPost, doGet } from '../../networking/ApiHelper';
import Loader from "../../components/Loader";

const Settings = (props) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");
    const [udInterval, setudInterval] = React.useState("");
    const [udMetric, setUdMetric] = React.useState("MINS");
    const [customUpdateInterval, setCustomUpdateInterval] = React.useState("");
    const [editMode, setEditMode] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [state, setState] = React.useState({
        vehicleType: "",
        vehicleHeight: "",
        vehicleWeight: "",
        transmissionConfig: "",
        engineCode: "",
        vehicleType: "",
        vehicleModel: "",
        manufacturer: "",
        vehicleClass: "",
        engineSize: null,
        vehicleType2: "",
        driveWheels: "",
    });

    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    React.useEffect(() => {
        const bootstrapAsync = async () => {
            setIsLoading(true);
            const getConfigurationResponse = await doGet(getConfigurationUrl);
            if (getConfigurationResponse) {
                setIsLoading(false);
                if (getConfigurationResponse.responseCode == 99) {
                    setState({
                        vehicleType: getConfigurationResponse.responseData.vehicleType || "",
                        vehicleHeight: getConfigurationResponse.responseData.vehicleHeight || "",
                        vehicleWeight: getConfigurationResponse.responseData.vehicleWeight || "",
                        transmissionConfig: getConfigurationResponse.responseData.transmissionConfig || "",
                        engineCode: getConfigurationResponse.responseData.engineCode || "",
                        // vehicleType: getConfigurationResponse.responseData.vehicleType || "",
                        vehicleModel: getConfigurationResponse.responseData.vehicleModel || "",
                        manufacturer: getConfigurationResponse.responseData.manufacturer || "",
                        vehicleClass: getConfigurationResponse.responseData.vehicleClass || "",
                        engineSize: getConfigurationResponse.responseData.engineSize,
                        vehicleType2: getConfigurationResponse.responseData.vehicleType2 || "",
                        driveWheels: getConfigurationResponse.responseData.driveWheels || ""
                    });
                    setIsEnabled(getConfigurationResponse.responseData.useDarkMode);
                    const bcUpdateInterval = getConfigurationResponse.responseData.updateInterval;
                    setSelectedValue(bcUpdateInterval);
                    if (bcUpdateInterval == "USER_DEFINED") {
                        setCustomUpdateInterval('Every ' + getConfigurationResponse.responseData.userDefinedInterval + getConfigurationResponse.responseData.userDefinedMetric.toString().toLowerCase());
                        setudInterval(""+ getConfigurationResponse.responseData.userDefinedInterval);
                        setUdMetric(getConfigurationResponse.responseData.userDefinedMetric);
                    }
                }
            } else {
                setIsLoading(false);
            }
        }

        bootstrapAsync();
    }, []);

    const toggleSwitch = async () => {
        setIsLoading(true);
        const enableDarkModeResponse = await doPost(updateConfigurationUrl, { useDarkMode: !isEnabled });
        if (enableDarkModeResponse) {
            setIsLoading(false);
            if (enableDarkModeResponse.responseCode == 99)
                setIsEnabled(enableDarkModeResponse.responseData.useDarkMode);
        } else {
            setIsLoading(false);
        }
    }

    const updateSelectedValue = async (value) => {
        if (value.trim().length > 0 && value != "CUSTOM") {
            if (value == "USER_DEFINED") {
                setModalVisible(true);
            } else {
                setIsLoading(true);
                const updateSelectedValueResponse = await doPost(updateConfigurationUrl, { updateInterval: value });
                if (updateSelectedValueResponse) {
                    setIsLoading(false);
                    if (updateSelectedValueResponse.responseCode == 99) {
                        setCustomUpdateInterval("");
                        setSelectedValue(updateSelectedValueResponse.responseData.updateInterval);
                    }
                } else {
                    setIsLoading(false);
                }
            }
        }
    }

    const updateIntervalManually = () => {
        setSelectedValue("USER_DEFINED");
        setModalVisible(false);
        setIsLoading(true);
        doPost(updateConfigurationUrl, { updateInterval: "USER_DEFINED", userDefinedInterval: udInterval, updateIntervalMetric: udMetric }).
            then(data => {
                if (data) {
                    setIsLoading(false);
                    if (data.responseCode == 99) {
                        setSelectedValue(data.responseData.updateInterval);
                        setCustomUpdateInterval('Every '+ data.responseData.userDefinedInterval + data.responseData.userDefinedMetric.toString().toLowerCase());
                        setudInterval(""+ data.responseData.userDefinedInterval);
                        setUdMetric(data.responseData.userDefinedMetric);
                    }
                }
            }).catch(err => {
                setIsLoading(false);
                console.log("A critical error occurred during update: ", err);
            })
    }

    const sendFormInfo = async () => {
        setIsLoading(true);
        const sendFormResponse = await doPost(updateConfigurationUrl, { ...state });
        if (sendFormResponse) {
            setIsLoading(false);
            if (sendFormResponse.responseCode == 99) {
                setState({
                    vehicleType: sendFormResponse.responseData.vehicleType || "",
                    vehicleHeight: sendFormResponse.responseData.vehicleHeight || "",
                    vehicleWeight: sendFormResponse.responseData.vehicleWeight || "",
                    transmissionConfig: sendFormResponse.responseData.transmissionConfig || "",
                    engineCode: sendFormResponse.responseData.engineCode || "",
                    vehicleType: sendFormResponse.responseData.vehicleType || "",
                    vehicleModel: sendFormResponse.responseData.vehicleModel || "",
                    manufacturer: sendFormResponse.responseData.manufacturer || "",
                    vehicleClass: sendFormResponse.responseData.vehicleClass || "",
                    engineSize: sendFormResponse.responseData.engineSize,
                    vehicleType2: sendFormResponse.responseData.vehicleType2 || "",
                    driveWheels: sendFormResponse.responseData.driveWheels || ""
                });
                setEditMode(false);
            }
        } else {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Use dark mode</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#c4c4c4" }}
                        thumbColor={isEnabled ? "#1266F1" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

                {/* <View style={styles.hr}></View> */}

                <View style={[styles.formGroup, styles.fdColumn]}>
                    <Text style={[styles.labelSm, isDarkMode ? styles.lightText : null]}>Information update interval</Text>
                    {/* <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} onChangeText={(value) => setState({ ...state, emailAddress: encryptData(value.trim().toLowerCase()) })} /> */}
                    <View style={styles.select}>
                        <Picker selectedValue={!customUpdateInterval || customUpdateInterval == "" ? selectedValue : "CUSTOM"} style={styles.picker} onValueChange={(itemValue, itemIndex) => updateSelectedValue(itemValue)} >
                            <Picker.Item label="Not Set" value="" />
                            <Picker.Item label="Never" value="NEVER" />
                            <Picker.Item label="Every 2mins" value="EVERY_2_MINS" />
                            <Picker.Item label="Every 10mins" value="EVERY_10_MINS" />
                            <Picker.Item label="Every 20mins" value="EVERY_20_MINS" />
                            <Picker.Item label="User Defined" value="USER_DEFINED" />
                            {customUpdateInterval && customUpdateInterval.trim() != "" ? <Picker.Item label={customUpdateInterval} value="CUSTOM" /> : null}
                            {/* <Picker.Item label="Only over Wi-FI" value="ONLY_OVER_WIFI" /> */}
                        </Picker>
                    </View>
                </View>

                {/* <View style={styles.hr}></View> */}

                <View style={[styles.formGroup]}>
                    <Text style={[styles.labelSm, isDarkMode ? styles.lightText : null]}>Vehicle Configuration</Text>
                    {
                        !editMode ?
                            (
                                <TouchableOpacity onPress={() => setEditMode(true)}>
                                    <FontAwesomeIcon icon={faEdit} size={20} style={{ color: Colors.primary }} />
                                </TouchableOpacity>
                            ) :
                            (
                                <TouchableOpacity onPress={() => sendFormInfo()}>
                                    <Text style={{ color: Colors.success }}>Update</Text>
                                </TouchableOpacity>
                            )
                    }
                </View>

                <View style={[styles.formGroup, styles.fdColumn, styles.borderedSet]}>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Vehicle ID</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.vehicleType.trim() != "" ? styles.active : null]}>{state.vehicleType.trim() == "" ? "Not Set" : state.vehicleType}</Text>
                                : null
                        }
                        {editMode ? <TextInput style={styles.textInput} placeholder='Enter vehicle type' value={state.vehicleType} onChangeText={(text) => { setState({ ...state, vehicleType: text }) }} /> : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Vehicle Class</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.vehicleClass.trim() != "" ? styles.active : null]}>{state.vehicleClass.trim() == "" ? "Not Set" : state.vehicleClass}</Text>
                                : null
                        }
                        {editMode ? (
                            <View style={[styles.select, styles.selectLighter]}>
                                <Picker selectedValue={state.vehicleClass} style={styles.picker} onValueChange={(itemValue, itemIndex) => setState({ ...state, vehicleClass: itemValue })} >
                                    <Picker.Item label="Not Set" value="" />
                                    <Picker.Item label="Car" value="CAR" />
                                    <Picker.Item label="SUV" value="SUV" />
                                </Picker>
                            </View>
                        ) : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Vehicle Type</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.vehicleType2.trim() != "" ? styles.active : null]}>{state.vehicleType2.trim() == "" ? "Not Set" : state.vehicleType2}</Text>
                                : null
                        }
                        {editMode ? (
                            <View style={[styles.select, styles.selectLighter]}>
                                <Picker selectedValue={state.vehicleType2} style={styles.picker} onValueChange={(itemValue, itemIndex) => setState({ ...state, vehicleType2: itemValue })} >
                                    <Picker.Item label="Not Set" value="" />
                                    <Picker.Item label="ICE" value="ICE" />
                                    <Picker.Item label="HEV" value="HEV" />
                                    <Picker.Item label="BEV" value="BEV" />
                                </Picker>
                            </View>
                        ) : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Engine Size (litres)</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.engineSize != null ? styles.active : null]}>{state.engineSize == null ? "Not Set" : state.engineSize}</Text>
                                : null
                        }
                        {editMode ? <TextInput keyboardType="numeric" style={styles.textInput} placeholder='Enter size' value={state.engineSize} onChangeText={(text) => { setState({ ...state, engineSize: text }) }} /> : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Drive Wheels</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.driveWheels.trim() != "" ? styles.active : null]}>{state.driveWheels.trim() == "" ? "Not Set" : state.driveWheels}</Text>
                                : null
                        }
                        {editMode ? (
                            <View style={[styles.select, styles.selectLighter]}>
                                <Picker selectedValue={state.driveWheels} style={styles.picker} onValueChange={(itemValue, itemIndex) => setState({ ...state, driveWheels: itemValue })} >
                                    <Picker.Item label="Not Set" value="" />
                                    <Picker.Item label="Two" value="TWO" />
                                    <Picker.Item label="Four" value="FOUR" />
                                </Picker>
                            </View>
                        ) : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Vehicle Height</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.vehicleHeight.trim() != "" ? styles.active : null]}>{state.vehicleHeight.trim() == "" ? "Not Set" : state.vehicleHeight}</Text>
                                : null
                        }
                        {editMode ? <TextInput style={styles.textInput} placeholder='Enter vehicle height' value={state.vehicleHeight} onChangeText={(text) => { setState({ ...state, vehicleHeight: text }) }} /> : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Vehicle Weight</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.vehicleWeight.trim() != "" ? styles.active : null]}>{state.vehicleWeight.trim() == "" ? "Not Set" : state.vehicleWeight}</Text>
                                : null
                        }
                        {editMode ? <TextInput style={styles.textInput} placeholder='Enter vehicle weight' value={state.vehicleWeight} onChangeText={(text) => { setState({ ...state, vehicleWeight: text }) }} /> : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        {/* <Text style={styles.item}>Transmission Configuration</Text> */}
                        <Text style={styles.item}>Transmission</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.transmissionConfig.trim() != "" ? styles.active : null]}>{state.transmissionConfig.trim() == "" ? "Not Set" : state.transmissionConfig}</Text>
                                : null
                        }
                        {/* {editMode ? <TextInput style={styles.textInput} placeholder='Enter transmission config.' value={state.transmissionConfig} onChangeText={(text) => { setState({ ...state, transmissionConfig: text }) }} /> : null} */}
                        {editMode ? (
                            <View style={[styles.select, styles.selectLighter]}>
                                <Picker selectedValue={state.transmissionConfig} style={styles.picker} onValueChange={(itemValue, itemIndex) => setState({ ...state, transmissionConfig: itemValue })} >
                                    <Picker.Item label="Not Set" value="" />
                                    <Picker.Item label="Manual" value="Manual" />
                                    <Picker.Item label="Automatic" value="Automatic" />
                                </Picker>
                            </View>
                        ) : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Engine Code</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.engineCode.trim() != "" ? styles.active : null]}>{state.engineCode.trim() == "" ? "Not Set" : state.engineCode}</Text>
                                : null
                        }
                        {editMode ? <TextInput style={styles.textInput} placeholder='Enter engine code' value={state.engineCode} onChangeText={(text) => { setState({ ...state, engineCode: text }) }} /> : null}
                    </View>
                    {/* <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Vehicle Type</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.vehicleType.trim() != "" ? styles.active : null]}>{state.vehicleType.trim() == "" ? "Not Set" : state.vehicleType}</Text>
                                : null
                        }
                        {editMode ? <TextInput style={styles.textInput} placeholder='Enter vehicle type' value={state.vehicleType} onChangeText={(text) => { setState({ ...state, vehicleType: text }) }} /> : null}
                    </View> */}
                    <View style={[styles.select, styles.mt0, styles.mb10, styles.borderedBottom]}>
                        <Text style={styles.item}>Vehicle Model</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.vehicleModel.trim() != "" ? styles.active : null]}>{state.vehicleModel.trim() == "" ? "Not Set" : state.vehicleModel}</Text>
                                : null
                        }
                        {editMode ? <TextInput style={styles.textInput} placeholder='Enter vehicle model' value={state.vehicleModel} onChangeText={(text) => { setState({ ...state, vehicleModel: text }) }} /> : null}
                    </View>
                    <View style={[styles.select, styles.mt0, styles.borderless]}>
                        <Text style={styles.item}>Manufacturer</Text>
                        {
                            !editMode ?
                                <Text style={[styles.item, styles.itemSm, state.manufacturer.trim() != "" ? styles.active : null]}>{state.manufacturer.trim() == "" ? "Not Set" : state.manufacturer}</Text>
                                : null
                        }
                        {editMode ? <TextInput style={styles.textInput} placeholder='Enter manufacturer' value={state.manufacturer} onChangeText={(text) => { setState({ ...state, manufacturer: text }) }} /> : null}
                    </View>

                    {
                        editMode ?
                            (
                                <View style={styles.formGroupNf}>
                                    <TouchableOpacity style={styles.button} onPress={() => sendFormInfo()}>
                                        <Text style={styles.textWhite}>Update information</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null
                    }
                    {/* <View style={styles.formGroupNf}>
                        <TouchableOpacity style={styles.button} onPress={() => console.log("Update Information Clicked")}>
                            <Text style={styles.textWhite}>Update information</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </ScrollView>

            <Loader show={isLoading} />


            <Modal
                animationType="slide"
                transparent={true}
                box
                visible={modalVisible}
                onRequestClose={() => {
                    setudInterval("");
                    setUdMetric("");
                }}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Update Interval</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                <FontAwesomeIcon icon={faTimes} size={18} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.hr}></View>
                        <View style={styles.modalBody}>
                            <View style={styles.formGroupModal}>
                                <Text style={styles.label}>Time Interval</Text>
                                <View style={styles.splitGroup}>
                                    <TextInput keyboardType="numeric" style={[styles.textInput, styles.splitGroupTextInput]} placeholder='Enter interval' onChangeText={(text) => { setudInterval(text) }} value={udInterval} />

                                    <View style={[styles.select, styles.splitGroupSelect]}>
                                        <Picker selectedValue={udMetric} style={styles.picker} onValueChange={(itemValue, itemIndex) => setUdMetric(itemValue)} >
                                            <Picker.Item label="MINUTES" value="MINS" />
                                            <Picker.Item label="HOURS" value="HOURS" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.formGroupModal}>
                                <TouchableOpacity style={styles.button} onPress={() => updateIntervalManually()}>
                                    <Text style={styles.textWhite}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default Settings;