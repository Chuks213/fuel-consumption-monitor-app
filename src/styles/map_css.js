import { StyleSheet } from "react-native";
import Colors from "./Colors";

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        // width: "100%",
        // height: 500,
        justifyContent: "flex-end",
        alignItems: "center"
    },

    map: {
        ...StyleSheet.absoluteFillObject
        // width: "100%",
        // height: 500
    },

    bubble: {
        flex: 1,
        backgroundColor: Colors.light,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 13,
        paddingRight: 13
    },

    latlng: {
        width: 200,
        alignItems: "stretch"
    },

    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },

    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
        backgroundColor: "transparent"
    },

    btnDanger: {
        color: Colors.danger,
        textTransform: "uppercase"
    },

    bottomBarContent: {
        color: Colors.primary,
        fontSize: 12
    }
});

export default styles;