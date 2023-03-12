import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, ToastAndroid, Platform, Alert, useColorScheme } from "react-native";
import styles from "../styles/login_css";
import Loader from "../components/Loader";
import { doGet, doPost } from '../networking/ApiHelper';
import { forgotPasswordUrl, resetPasswordUrl, validateConfirmationCodeUrl } from '../networking/Routes';
import CodeInput from 'react-native-confirmation-code-input';
import {encryptData} from "../components/Encryption";

const ForgotPassword = (props) => {
    const isDarkMode = useColorScheme() === 'dark';

    const [state, setState] = useState({
        isLoading: false,
        emailAddress: "",
        step: 1,
        confirmationCode: "",
        newPassword: "",
        confirmNewPassword: "",
        showResendLink: false
    });

    const { goBack } = props.navigation;
    const confirmationCodeRef = useRef(null);
    let resendLinkTimeout = null;

    useEffect(() => {
        if(resendLinkTimeout)
            clearTimeout(resendLinkTimeout);
    }, [resendLinkTimeout]);

    const displayNotification = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } else {
            Alert.alert(message);
        }
    }

    const submit = async () => {
        if (state.emailAddress.trim() == "") {
            displayNotification("An email address is required");
            return;
        }
        setState({ ...state, isLoading: true });
        let forgotPasswordResponse = await doPost(forgotPasswordUrl, state);
        setState({ ...state, isLoading: false });
        if (forgotPasswordResponse) {
            if (forgotPasswordResponse.responseCode == 99) {
                setState({ ...state, step: 2 });
                displayNotification("Password reset initiated successfully. Please check your mail for a confirmation code");
                resendLinkTimeout = setTimeout(() => {setState({...state, showResendLink: true})}, 600000);
            } else displayNotification(forgotPasswordResponse.errorMessage);
        } else displayNotification("We are unable to reset your password at this time. Please try agian later");
    }

    const validateConfirmationCode = async (code) => {
        if (!code) {
            displayNotification("A confirmation code is required");
            return;
        }

        if (code.trim() == "") {
            displayNotification("A confirmation code is required");
            return;
        }
        setState({ ...state, confirmationCode: code, isLoading: true });
        let validateCodeResponse = await doGet(`${validateConfirmationCodeUrl}/${code}/${state.emailAddress}`);
        if (validateCodeResponse) {
            if (validateCodeResponse.responseCode == 99) {
                setState({ ...state, step: 3, isLoading: false, confirmationCode: code });
            } else {
                setState({...state, showResendLink: true, isLoading: false});
                displayNotification(validateCodeResponse.errorMessage);
            }
        } else {
            setState({...state, showResendLink: true, isLoading: false});
            displayNotification("We are unable to process your request at this time. Please try agian later");
        }
    }

    const reset = async () => {
        if (state.newPassword.trim() == "") {
            displayNotification("New password is required");
            return;
        }

        if (state.confirmNewPassword.trim() == "") {
            displayNotification("Confirm new password is required");
            return;
        }
        setState({ ...state, isLoading: true });
        let resetPasswordResponse = await doPost(resetPasswordUrl, state);
        setState({ ...state, isLoading: false });
        if (resetPasswordResponse) {
            if (resetPasswordResponse.responseCode == 99) {
                displayNotification("Password reset initiated successfully. Kindly login with new password");
                props.navigation.goBack();
            } else displayNotification(resetPasswordResponse.errorMessage);
        } else displayNotification("We are unable to reset your password at this time. Please try agian later");
    }

    const renderView = () => {
        const defaultView = (
            <View style={styles.formGroup}>
                <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Email Address</Text>
                <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} onChangeText={(value) => setState({ ...state, emailAddress: encryptData(value) })} />
            </View>
        );
        switch (state.step) {
            case 1:
                return defaultView;
            case 2:
                return (
                    <>
                        <Text style={{ textAlign: "center", fontFamily: "Poppins-Regular", fontSize: 15, color: "#777" }}>Enter Confirmation Code</Text>
                        <CodeInput
                            ref={confirmationCodeRef}
                            secureTextEntry
                            activeColor={isDarkMode ? '#fff' : 'rgba(0, 0, 0, 1)'}
                            inactiveColor={isDarkMode ? '#fff' : 'rgba(0, 0, 0, 1.3)'}
                            autoFocus={false}
                            ignoreCase={true}
                            inputPosition='center'
                            size={50}
                            onFulfill={(code) => validateConfirmationCode(code)}
                            containerStyle={{ marginTop: 20, marginBottom: 30 }}
                            codeInputStyle={{ borderWidth: 1.5 }}
                        />
                        {
                            state.showResendLink ? (
                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => submit()}>
                                    <Text style={{ textDecorationLine: "underline", color: "#000", fontFamily: "Poppins-Regular", fontSize: 13 }}>Resend confirmation code?</Text>
                                </TouchableOpacity>
                            ) : <></>
                        }
                        <View style={styles.clearFix} />
                    </>
                );
            case 3:
                return (
                    <>
                        <View style={styles.formGroup}>
                            <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>New Password</Text>
                            <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} secureTextEntry onChangeText={(value) => setState({ ...state, newPassword: value })} />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Confirm New Password</Text>
                            <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} secureTextEntry onChangeText={(value) => setState({ ...state, confirmNewPassword: value })} />
                        </View>
                    </>
                );
            default:
                return defaultView;
        }
    }

    const renderSubmitButton = () => {
        const defaultButton = (
            <View style={styles.formGroup}>
                <TouchableOpacity style={styles.button} onPress={() => submit()}>
                    <Text style={styles.textWhite}>Submit</Text>
                </TouchableOpacity>
            </View>
        );
        switch (state.step) {
            case 1:
                return defaultButton;
            case 2:
                return <></>;
            case 3:
                return (
                    <View style={styles.formGroup}>
                        <TouchableOpacity style={styles.button} onPress={() => reset()}>
                            <Text style={styles.textWhite}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return defaultButton;
        }
    }


        return (
            <SafeAreaView style={[styles.container, isDarkMode ? styles.containerD : null]}>
                <View style={styles.containerTop}>
                </View>
                <ScrollView style={styles.main}>
                    <Text style={[styles.textBg, isDarkMode ? styles.lightText : null]}>Forgot Password</Text>

                    <View style={styles.clearFix} />

                    {renderView()}

                    {renderSubmitButton()}

                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => goBack()}>
                            <Text style={[styles.link, isDarkMode ? styles.lightText : null]}>Back to login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.clearFix} />
                </ScrollView>
                <Loader show={state.isLoading} />
            </SafeAreaView>
        );
}

export default ForgotPassword;