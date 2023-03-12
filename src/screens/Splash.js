import * as React from 'react';
import {View, useColorScheme} from 'react-native';
import styles from '../styles/splash_css';
import Loader from '../components/Loader';
import AppColor from '../styles/Colors';

const Splash = () => {
    const isDarkMode = useColorScheme() === 'dark';

    return(
        <View style={[styles.container, isDarkMode ? styles.bgDark : null]}>
            <Loader show={true} style={styles.loader} loaderColor={isDarkMode ? AppColor.white : AppColor.dark} />
        </View>
    );
}

export default Splash;