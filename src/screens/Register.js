import React, {useState, useContext} from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, ToastAndroid, Platform, Alert, useColorScheme } from "react-native";
import styles from "../styles/login_css";
import Loader from "../components/Loader";
import { AuthContext } from "../Main";

const Register = (props) => {
    const isDarkMode = useColorScheme() === 'dark';

    const { signUp } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const { goBack } = props.navigation;
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });

    const validateRequiredFields = () => {
        if(state.firstName.trim() == "") {
            return displayNotification("First name is required");
        }else if(state.lastName.trim() == "") {
            return displayNotification("Last name is required");
        }else if(state.password.trim() == "") {
            return displayNotification("Password is required");
        }else if(state.confirmPassword.trim() == "") {
            return displayNotification("Confirm password is required");
        }else if(state.emailAddress.trim() == "" && state.phoneNumber.trim() == "") {
            return displayNotification("An email address or phone number is required");
        }
        return true;
    }

    const register = async () => {
        if(!validateRequiredFields()) {
            return;
        }

        setIsLoading(true);
        let isSignUpSuccessful = await signUp(state);
        if(!isSignUpSuccessful) setIsLoading(false);
        else goBack();
    }

    const displayNotification = (message) => {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } else {
            Alert.alert(message);
        }
        return false;
    }
        
    return(
        <SafeAreaView style={[styles.container, isDarkMode ? styles.containerD : null]}>
            <ScrollView style={styles.main}>
                <Text style={[styles.textMd, isDarkMode ? styles.lightText : null]}>Create Account</Text>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>First Name</Text>
                    <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} onChangeText={(value) => setState({...state, firstName: value.trim()})} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Last Name</Text>
                    <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} onChangeText={(value) => setState({...state, lastName: value.trim()})} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Email Address</Text>
                    <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} onChangeText={(value) => setState({...state, emailAddress: value.trim()})} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Password</Text>
                    <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} secureTextEntry onChangeText={(value) => setState({...state, password: value})} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Confirm Password</Text>
                    <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} secureTextEntry onChangeText={(value) => setState({...state, confirmPassword: value})} />
                </View>

                <View style={styles.formGroup}>
                    <TouchableOpacity style={styles.button} onPress={() => register()}>
                        <Text style={styles.textWhite}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <Text style={[styles.link, isDarkMode ? styles.lightText : null]}>Back to login</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.clearFix} />
            </ScrollView>
            <Loader show={isLoading} />
        </SafeAreaView>
    );
}

export default Register;