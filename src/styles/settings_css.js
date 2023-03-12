import { StyleSheet } from 'react-native';
import AppColor from './Colors';

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: AppColor.light,
        paddingLeft: 10,
        // paddingRight: 30,
        paddingRight: 10,
        // paddingTop: 30,
        paddingTop: 15
    },

    formGroup: {
        paddingTop: 3,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    formGroupModal: {
        paddingTop: 3,
        paddingBottom: 10
    },

    formGroupNf: {
        paddingTop: 20,
        paddingBottom: 10,
    },

    fdColumn: {
        flexDirection: "column"
    },

    // label: {
    //     // paddingBottom: 5,
    //     fontSize: 16,
    //     fontFamily: "Poppins-Regular",
    //     color: AppColor.black
    // },

    labelSm: {
        fontSize: 15,
        fontFamily: "Arapey-Regular",
        color: AppColor.black,
        fontWeight: "600"
    },

    button: {
        backgroundColor: AppColor.primary,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 0 , 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },

    select: {
        borderWidth: 1,
        borderColor: AppColor.lightGrey,
        borderRadius: 10,
        marginTop: 7,
    },

    selectLighter: {
        backgroundColor: AppColor.lighter
    },

    splitGroupSelect: {
        width: "49%",
        marginTop: 0
    },

    borderedBottom: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0
    },

    borderless: {
        borderWidth: 0
    },

    mt0: {
        marginTop: 0
    },

    picker: {
        width: "100%",
        fontFamily: "Arapey-Regular",
        color: AppColor.black
    },

    hr: {
        height: 0.7, 
        backgroundColor: AppColor.lightGrey, 
        marginTop: 10, 
        marginBottom: 10
    },

    item: {
        minHeight: 35,
        display: "flex",
        textAlignVertical: "center",
        paddingLeft: 8,
        color: AppColor.black
    },

    itemSm: {
        minHeight: 30,
        color: AppColor.danger
    },

    active: {
        color: AppColor.success
    },

    mb10: {
        marginBottom: 10
    },

    borderedSet: {
        borderColor: AppColor.lightGrey,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginBottom: 15
    },

    // textInput: {
    //     borderWidth: 1,
    //     borderColor: AppColor.black,
    //     borderRadius: 10,
    //     padding: 10
    // },

    button: {
        backgroundColor: AppColor.success,
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
        color: AppColor.white
    },

    modal: {
        height: '43%',
        marginTop: 'auto',
        backgroundColor: AppColor.lighter,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20
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

    splitGroupTextInput: {
        width: "50%"
    },

    darkModeTextInput: {
        backgroundColor: AppColor.dark,
        borderColor: AppColor.light,
        color: AppColor.white
    },

    // formGroup: {
    //     paddingTop: 3,
    //     paddingBottom: 10
    // },

    splitGroup: {
        flexDirection: "row",
        justifyContent: "space-between"
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
});

export default styles;