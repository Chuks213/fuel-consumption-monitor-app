import {StyleSheet} from 'react-native';
import AppColor from './Colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColor.light,
        flex: 1
    },

    bgDark: {
        backgroundColor: AppColor.dark
    },

    appLogo: {
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        flex: 1
    },

    loader: {
        position: 'absolute',
        top: "46%",
        left: "44%"
    }
});

export default styles;