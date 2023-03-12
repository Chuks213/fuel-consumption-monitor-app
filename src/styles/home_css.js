import {StyleSheet} from 'react-native';
import AppColor from './Colors';

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: AppColor.light
    },

    btnBg: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: "#dd0000",
        borderWidth: 10,
        borderColor: AppColor.darker
    },

    btnStart: {
        backgroundColor: AppColor.success
    },

    btnText: {
        color: "#FFFFFF",
        fontSize: 23,
        fontFamily: "Arapey-Italic"
    },

    smallestRound: {
        width: 90,
        height: 90,
        backgroundColor: "#ee0000"
    },

    modal: {
        // height: '50%',
        height: "43%",
        marginTop: 'auto',
        backgroundColor: AppColor.lighter,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20
    },

    modal50: {
        height: '65%'
    },

    modalHeader: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 5,
        borderBottomColor: AppColor.dark
    },

    modalText: {
        fontSize: 17,
        fontWeight: "600",
        color: AppColor.black,
        textTransform: "uppercase"
    },

    modalBody: {
        marginTop: 5
    },

    hr: {
        height: 1.5, 
        backgroundColor: AppColor.danger, 
        marginTop: 10, 
        marginBottom: 10
    },

    textInput: {
        backgroundColor: AppColor.lighter,
        color: "#000",
        fontFamily: "Poppins-Regular",
        fontSize: 13,
        borderWidth: 1.2,
        borderColor: AppColor.lightGrey,
        borderRadius: 10,
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

    miniMapView: {
        alignSelf: "flex-end",
        position: "absolute",
        bottom: 0,
        width: 210,
        height: 180
    },

    miniMapImage: {
        maxWidth: 210,
        maxHeight: 180
    },

    select: {
        borderWidth: 1,
        borderColor: AppColor.lightGrey,
        borderRadius: 10,
        marginTop: 7,
    },
});

export default styles;