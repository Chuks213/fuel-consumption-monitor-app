import React, { useState, useContext } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, ToastAndroid, Platform, Alert, useColorScheme } from "react-native";
import styles from "../styles/login_css";
import Loader from "../components/Loader";
import { AuthContext } from "../Main";
import {encryptData} from "../components/Encryption";


const Login = (props) => {
    const isDarkMode = useColorScheme() === 'dark';

    const { signIn } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const { navigate } = props.navigation;
    const [state, setState] = useState({
        emailAddress: "",
        password: ""
    });

    const login = async () => {
        if(state.emailAddress.trim() == "" || state.password.trim() == "") {
            displayNotification("Please fill all fields to continue");
            return;
        }

        setIsLoading(true);
        let isSignedIn = await signIn(state);
        if(!isSignedIn) setIsLoading(false);
    }

    const displayNotification = (message) => {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } else {
            Alert.alert(message);
        }
    }

    return (
        <SafeAreaView style={[styles.container, isDarkMode ? styles.containerD : null]}>
            <View style={styles.containerTop}>
            </View>
            <ScrollView style={styles.main}>
                <Text style={[styles.textBg, isDarkMode ? styles.lightText : null]}>Login</Text>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Email Address</Text>
                    <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} onChangeText={(value) => setState({...state, emailAddress: encryptData(value.trim().toLowerCase())})} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDarkMode ? styles.lightText : null]}>Password</Text>
                    <TextInput style={[styles.textInput, isDarkMode ? styles.darkModeTextInput : null]} secureTextEntry onChangeText={(value) => setState({...state, password: value})} />
                </View>

                <View style={styles.formGroup}>
                    <TouchableOpacity style={styles.button} onPress={() => login()}>
                        <Text style={styles.textWhite}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity onPress={() => { navigate("ForgotPassword"); }}>
                        <Text style={[styles.link, isDarkMode ? styles.lightText : null]}>Forgot Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigate("Register"); }}>
                        <Text style={[styles.link, isDarkMode ? styles.lightText : null]}>Create Account</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.clearFix} />
            </ScrollView>
            <Loader show={isLoading} />
        </SafeAreaView>
    );
}

export default Login;