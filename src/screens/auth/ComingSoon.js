import React, {useContext} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../../Main";
import AppColor from '../../styles/Colors';

const Home = (props) => {
    const { signOut } = useContext(AuthContext);

    return(
        <View style={{justifyContent: "center", flex: 1, backgroundColor: "#f7f7f7"}}>
            {/* <Text style={{textAlign: "center", fontFamily: "Arapey-Italic", fontSize: 30, color: "#000"}}>Work in progress...</Text>
            <View style={{height: 30}}></View>
            <TouchableOpacity style={{backgroundColor: AppColor.primary, padding: 15, borderRadius: 10, width: 150, alignSelf: "center", borderWidth:1, borderColor:'rgba(0, 0 , 0, 0.5)', alignItems:'center', justifyContent:'center', borderTopRightRadius: 0}} onPress={() => signOut()}>
                <Text style={{fontFamily: "Poppins-Regular", fontSize: 13, color: "#fff"}}>Sign Out</Text>
            </TouchableOpacity> */}
        </View>
    );
}

export default Home;