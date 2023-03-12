import {getUserToken} from '../components/HostMaster';

export const doGet = async (url) => {
    console.log("GET URL: " + url);
    const userToken = await getUserToken();
    let jsonHeader = {}
    if(userToken) jsonHeader['Authorization'] = `Bearer ${userToken}`;
    try{
        let response = await fetch(url, {
            method: 'GET',
            headers: jsonHeader
        });
        if(response.status == 401) 
            return {responseCode: 21, errorMessage: "Your session has expired. Kindly login again"};
        let responseToJson = await response.json();
        console.log("Response gotten (GET) is: ", responseToJson);
        return responseToJson;
    }catch(ex){
        console.log(ex);
        return null;
    }
}

export const doPost = async (url, postData, sendRaw) => {
    console.log("POST URL: " + url);
    console.log("POST data: ", postData);
    const userToken = await getUserToken();
    let jsonHeader = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
    }
    if(userToken) jsonHeader['Authorization'] = `Bearer ${userToken}`;
    try{
        let response = await fetch(url, {
            method: 'POST',
            headers: jsonHeader,
            body: sendRaw ? postData : JSON.stringify(postData)
        });
        // console.log("Response gotten is: ", response);
        if(response.status == 401) 
            return {responseCode: 21, errorMessage: "Your session has expired. Kindly login again"};
        let responseToJson = await response.json();
        console.log("Response gotten (POST) is: ", responseToJson);
        return responseToJson;
    }catch(ex){
        console.log(ex);
        return null;
    }
}