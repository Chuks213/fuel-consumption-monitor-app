import {retriveItem, removeItem, storeItem} from "../data/Storage";
import {doGet as getData} from '../networking/ApiHelper';
import {getUserDetailsUrl} from '../networking/Routes';

const tokenId = "fc-mobile-auth-tk";

const getUserToken = async () => {
    let userToken = await retriveItem(tokenId);
    return !userToken ? null : userToken;
}

const storeUserToken = (userToken) => {
    removeItem(tokenId);
    storeItem(tokenId, userToken, false);
}

const fetchCurrentUser = async () => {
    let userResponse = await getData(getUserDetailsUrl);
    if(userResponse) {
        if(userResponse.responseCode == 99) return userResponse.responseData;
    }
    return null;
}

const logout = () => {
    removeItem(tokenId);
}

export {
    getUserToken, 
    storeUserToken,
    fetchCurrentUser,
    logout
};