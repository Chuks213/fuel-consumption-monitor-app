import * as React from "react";
import { View, Text, Image, Modal, TouchableOpacity, ScrollView, TextInput, ToastAndroid, Platform, Alert } from "react-native";
import styles from "../styles/header_css";
import { decryptData, encryptData } from "./Encryption";
import { fetchCurrentUser } from "./HostMaster";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faGasPump } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../Main";
import Loader from "./Loader";
import { doPost } from "../networking/ApiHelper";
import { editProfileUrl } from "../networking/Routes";
import { launchImageLibrary } from 'react-native-image-picker';


const CustomHeader = (props) => {
    const { performTripAction, isTripActive } = React.useContext(AuthContext);

    const defaultImageUri = require('../../public/images/avatar.jpg');
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [initEmailAddress, setInitEmailAddress] = React.useState("");
    const [emailAddress, setEmailAddress] = React.useState("");
    const [oldPassword, setOldPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
    const [profilePhoto, setProfilePhoto] = React.useState("https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png");
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isDefailtView, setIsDefaultView] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const { signOut, autoSignIn } = React.useContext(AuthContext);

    const getUser = async () => {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
            setFirstName(currentUser.firstName);
            setLastName(currentUser.lastName);
            setEmailAddress(currentUser.emailAddress);
            setInitEmailAddress(currentUser.emailAddress);
            setProfilePhoto(currentUser.profilePhotoUrl);
        }
    }

    React.useEffect(() => {
        getUser();
    }, []);

    const displayNotification = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } else {
            Alert.alert(message);
        }
    }

    const updateInformation = (isPasswordChange) => {
        const decryptedFirstName = decryptData(firstName);
        const decryptedLastName = decryptData(lastName);
        const decryptedEmail = decryptData(emailAddress);

        if (!isPasswordChange) {
            if (decryptedEmail.trim() == "") {
                displayNotification("Email address is required");
                return;
            }

            if (decryptedFirstName.trim() == "") {
                displayNotification("First name is required");
                return;
            }

            if (decryptedLastName.trim() == "") {
                displayNotification("Last name is required");
                return;
            }
        } else {
            if (oldPassword.trim() == "") {
                displayNotification("Old password is required");
                return;
            }

            if (newPassword.trim() == "") {
                displayNotification("New password is required");
                return;
            }

            if (confirmNewPassword.trim() == "") {
                displayNotification("Confirm new password is required");
                return;
            }
        }
        setIsLoading(true);

        const postBody = !isPasswordChange ? {
            firstName: decryptedFirstName,
            lastName: decryptedLastName,
            emailAddress: decryptedEmail
        } : {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword
        };

        if (initEmailAddress == emailAddress) delete postBody.emailAddress;
        doPost(editProfileUrl, postBody).then(record => {
            setIsLoading(false);
            if (record.responseCode == 99) {
                if (isPasswordChange) {
                    displayNotification("Password changed successfully. Kindly login to continue");
                    signOut();
                } else {
                    if (record.responseData.newToken)
                        autoSignIn(record.responseData.newToken);
                    displayNotification(record.message);
                }
            } else {
                displayNotification(record.errorMessage);
            }
        }).catch(err => {
            setIsLoading(false);
            displayNotification("An error occurred while trying to edit profile. Please check your internet connection and try again later");
            console.log("An error occurred: " + err);
        });
    }

    const uploadPhoto = () => {
        setIsLoading(true);
        launchImageLibrary({ mediaType: "photo", includeBase64: true }).then(result => {
            if (result.assets) {
                if (result.assets.length > 0) {
                    const mainAsset = result.assets[0];
                    doPost(editProfileUrl, {
                        profilePhoto: 'data:image/jpeg;base64,' + mainAsset.base64
                    }).then(record => {
                        setIsLoading(false);
                        if (record.responseCode == 99) {
                            displayNotification(record.message);
                            getUser();
                        } else {
                            displayNotification(record.errorMessage);
                        }
                    }).catch(err => {
                        setIsLoading(false);
                        displayNotification("An error occurred while trying to edit profile. Please check your internet connection and try again later");
                        console.log("An error occurred: " + err);
                    });
                }
            }
        }).catch(err => {
            setIsLoading(false);
            console.log("Error while capturing image: " + err);
            displayNotification("An error occurred while trying to load photo");
        });
    }

    return (
        <View>
            {/* <View style={[styles.main, props.isHome ? null : styles.j_c_f_end]}> */}
            <View style={styles.main}>
                {/* {props.route.name === "Home" ? <Text style={styles.welcomeText}>Hello {decryptData(firstName)}!</Text> : <Text style={styles.welcomeText}>{props.route.name}</Text>} */}
                {/* <TouchableOpacity style={styles.refuelBtn} onPress={() => setModalVisible(true)}>
                    <FontAwesomeIcon icon={faGasPump} size={18} style={{ color: "#fff" }} />
                </TouchableOpacity> */}
                {
                    !isTripActive ?
                        props.route.name === "Home" ? <Text style={styles.welcomeText}>Hello {decryptData(firstName)}!</Text> : <Text style={styles.welcomeText}>{props.route.name}</Text> :
                        props.route.name !== "Home" ? <Text style={styles.welcomeText}>{props.route.name}</Text> : null
                }
                {
                    isTripActive ? (
                        props.route.name === "Home" ?
                        <TouchableOpacity style={styles.refuelBtn} onPress={() => performTripAction("REFUEL")}>
                            <FontAwesomeIcon icon={faGasPump} size={18} style={{ color: "#fff" }} />
                            <Text style={styles.refuelText}>Refuel</Text>
                        </TouchableOpacity> : null
                    ) : null
                }
                <TouchableOpacity style={styles.imageBox} onPress={() => setModalVisible(true)}>
                    <Image style={styles.imageResponsive} source={profilePhoto ? { uri: profilePhoto } : defaultImageUri} />
                </TouchableOpacity>
            </View>

            <Modal animationType="slide" transparent={true} box visible={modalVisible}>
                <View style={{ flex: 1 }}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    setModalVisible(false);
                                }}>
                                <FontAwesomeIcon icon={faArrowLeft} size={18} style={{ marginTop: 4.3 }} />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Profile Information</Text>
                            <View></View>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <View style={styles.fdRow}>
                                <View style={[styles.imageBox, styles.imageBoxBg]}>
                                    <Image style={[styles.imageResponsive, styles.imageResponsiveBg]} source={profilePhoto ? { uri: profilePhoto } : defaultImageUri} />
                                </View>
                                <TouchableOpacity style={styles.changePhotoLink} onPress={() => uploadPhoto()}>
                                    <Text style={styles.darkText}>Change Photo</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.paddedView}>
                                {
                                    isDefailtView ? (
                                        <View>
                                            <Text style={styles.h5}>Personal Information</Text>
                                            <View style={styles.infoBox}>
                                                <View style={styles.formGroup}>
                                                    <Text style={styles.label}>Email Address</Text>
                                                    <TextInput style={styles.textInput} placeholder='Enter email address' value={decryptData(emailAddress)} onChangeText={(value) => setEmailAddress(encryptData(value.trim().toLowerCase()))} />
                                                </View>
                                                <View style={styles.formGroup}>
                                                    <Text style={styles.label}>First Name</Text>
                                                    <TextInput style={styles.textInput} placeholder='Enter first name' value={decryptData(firstName)} onChangeText={(value) => setFirstName(encryptData(value.trim()))} />
                                                </View>
                                                <View style={styles.formGroup}>
                                                    <Text style={styles.label}>Last Name</Text>
                                                    <TextInput style={styles.textInput} placeholder='Enter last name' value={decryptData(lastName)} onChangeText={(value) => setLastName(encryptData(value.trim()))} />
                                                </View>
                                                <View style={styles.formGroup}>
                                                    <TouchableOpacity style={styles.button} onPress={() => updateInformation(false)}>
                                                        <Text style={styles.textWhite}>Update information</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                        <View>
                                            <Text style={styles.h5}>Update Password</Text>
                                            <View style={styles.infoBox}>
                                                <View style={styles.formGroup}>
                                                    <Text style={styles.label}>Old Password</Text>
                                                    <TextInput style={styles.textInput} secureTextEntry onChangeText={(value) => setOldPassword(value)} />
                                                </View>
                                                <View style={styles.formGroup}>
                                                    <Text style={styles.label}>New Password</Text>
                                                    <TextInput style={styles.textInput} secureTextEntry onChangeText={(value) => setNewPassword(value)} />
                                                </View>
                                                <View style={styles.formGroup}>
                                                    <Text style={styles.label}>Confirm New Password</Text>
                                                    <TextInput style={styles.textInput} secureTextEntry onChangeText={(value) => setConfirmNewPassword(value)} />
                                                </View>
                                                <View style={styles.formGroup}>
                                                    <TouchableOpacity style={styles.button} onPress={() => updateInformation(true)}>
                                                        <Text style={styles.textWhite}>Done</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }

                                {
                                    isDefailtView ? (
                                        <TouchableOpacity style={styles.clickableItemHalf} onPress={() => setIsDefaultView(false)}>
                                            <Text style={styles.changePwdLink}>Change Password</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.clickableItemHalf} onPress={() => setIsDefaultView(true)}>
                                            <Text style={styles.changePwdLink}>Update Personal Information</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                <TouchableOpacity style={styles.clickableItem} onPress={() => signOut()}>
                                    <Text style={styles.logoutLink}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>

                <Loader show={isLoading} />
            </Modal>
        </View>
    );
};

export default CustomHeader;