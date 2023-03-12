import { StyleSheet } from "react-native";
import AppColor from './Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColor.light,
        paddingTop: 2,
        paddingBottom: 2
    },

    containerTop: {
        height: "18%"
    },

    containerD: {
        backgroundColor: AppColor.dark
    },

    main: {
        padding: 30
    },

    textBg: {
        fontSize: 29,
        fontFamily: "Arapey-Italic",
        textAlign: "center",
        textTransform: "capitalize",
        paddingBottom: 7,
        color: "#000"
    },

    textMd: {
        fontSize: 28,
        fontFamily: "Arapey-Italic",
        textAlign: "center",
        textTransform: "capitalize",
        paddingBottom: 7,
        color: "#000"
    },

    lightText: {
        color: AppColor.light
    },

    textInput: {
        backgroundColor: AppColor.light,
        color: "#000",
        fontFamily: "Poppins-Regular",
        fontSize: 13,
        borderWidth: 1.2,
        borderColor: "rgba(0, 0, 0, 0.5)",
        // borderRadius: 10,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0
    },

    darkModeTextInput: {
        backgroundColor: AppColor.dark,
        borderColor: AppColor.light,
        color: AppColor.white
    },

    formGroup: {
        paddingTop: 3,
        paddingBottom: 10
    },

    label: {
        // paddingBottom: 5,
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: AppColor.black
    },

    button: {
        backgroundColor: AppColor.primary,
        padding: 15,
        borderWidth:1,
        borderColor:'rgba(0, 0 , 0, 0.5)',
        alignItems:'center',
        justifyContent:'center',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },

    textWhite: {
        color: "#fff",
        fontFamily: "Poppins-Regular",
        fontSize: 15
    },

    row: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-around"
    },

    link: {
        fontFamily: "Arapey-Italic",
        fontSize: 15,
        color: AppColor.primary
    },

    clearFix: {
        height: 10
    }
});

export default styles;