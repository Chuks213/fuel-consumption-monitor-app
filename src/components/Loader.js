import React, {useEffect} from 'react';
import {View} from 'react-native';
import styles from '../styles/loader_css';
import {MaterialIndicator} from 'react-native-indicators';
import { LogBox } from 'react-native';
import AppColor from '../styles/Colors';

const Loader = (props) => {
    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, []);

    return(
        <View style={props.show ? (props.style ? styles.colorlessContainer : styles.container) : styles.hiddenContainer}>
            <MaterialIndicator color={props.loaderColor ? props.loaderColor : AppColor.dark} animating={props.show} style={props.style} size={50} />
        </View>
    );
}

export default Loader;