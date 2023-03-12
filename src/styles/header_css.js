import { StyleSheet } from "react-native";
import Colors from "./Colors";

const styles = StyleSheet.create({
    main: {
        height: 50,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        paddingRight: 10,
        paddingTop: 10,
        paddingLeft: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    j_c_f_end: {
        justifyContent: "flex-end"
    },

    welcomeText: {
        fontSize: 23,
        fontFamily: "Arapey-Regular",
        color: Colors.dark
    },

    imageResponsive: {
        width: 32,
        height: 32,
        borderRadius: 32/2,
        borderWidth: 1/2,
    },

    imageResponsiveBg: {
        width: 92,
        height: 92,
        borderRadius: 92/2
    },

    imageBox: {
        borderColor: Colors.darker,
        borderWidth: 1,
        borderRadius: 50,
        width: 38,
        height: 38,
        padding: 2.5
    },

    imageBoxBg: {
        width: 98,
        height: 98
    },

    modal: {
        height: '100%',
        marginTop: 'auto',
        backgroundColor: Colors.lighter,
        padding: 20
    },

    modalHeader: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 5,
        borderBottomColor: Colors.dark
    },

    modalText: {
        fontSize: 17,
        fontWeight: "600",
        color: Colors.black,
        textTransform: "uppercase"
    },

    modalBody: {
        marginTop: 5
    },

    fdRow: {
        flexDirection: "row"
    },

    changePhotoLink: {
        alignSelf: "center", 
        paddingLeft: 30
    },

    darkText: {
        color: Colors.primary,
        fontSize: 14,
        fontFamily: "Arapey-Regular"
    },

    logoutLink: {
        color: Colors.danger,
        fontSize: 16,
        fontWeight: "600"
    },

    paddedView: {
        padding: 20,
        paddingLeft: 8.5
    },

    clickableItem: {
        marginTop: 10,
        marginBottom: 10
    },

    clickableItemHalf: {
        marginTop: 10
    },

    changePwdLink: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: "600"
    },

    h5: {
        fontSize: 14,
        fontFamily: "Arapey-Regular",
        color: Colors.dark,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
        paddingBottom: 5
    },

    textInput: {
        backgroundColor: Colors.lighter,
        color: "#000",
        fontFamily: "Poppins-Regular",
        fontSize: 13,
        borderWidth: 1.2,
        borderColor: Colors.lightGrey,
        borderRadius: 10,
    },

    darkModeTextInput: {
        backgroundColor: Colors.dark,
        borderColor: Colors.light,
        color: Colors.white
    },

    formGroup: {
        paddingTop: 3,
        paddingBottom: 10
    },

    label: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        color: Colors.black
    },

    button: {
        backgroundColor: Colors.warning,
        padding: 15,
        borderWidth:1,
        borderColor:'rgba(0, 0 , 0, 0.5)',
        alignItems:'center',
        justifyContent:'center',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },

    infoBox: {
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey
    },

    textWhite: {
        color: Colors.dark,
        fontFamily: "Poppins-Regular",
        fontSize: 15
    },

    refuelBtn: {
        backgroundColor: Colors.danger,
        // padding: 10,
        borderWidth:1,
        borderColor:'rgba(0, 0 , 0, 0.5)',
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 15,
        padding: 30,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
    },

    refuelText: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        paddingLeft: 8,
    }
});

export default styles;