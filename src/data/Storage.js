import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeItem = async (key, value, stringifyContent) => {
    try {
        await AsyncStorage.setItem(key, stringifyContent ? JSON.stringify(value) : value);
    } catch (error) {
        console.log("An error occurred while attempting to store item...", error);
    }
}

export const retriveItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.log("An error occurred while attempting to retrive item...", error);
        return null;
    }
}

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log("An error occurred while attempting to remove item...", error);
    }
}