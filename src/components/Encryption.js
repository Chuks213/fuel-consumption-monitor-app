import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse("112odvRDSWLOP3FF");
const iv = CryptoJS.enc.Utf8.parse("wellsfargoFF34TY");

export const encryptData = ((data) => {
    const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });
    return encrypted.toString();
});

export const decryptData = ((data) => {
    const decrypted = CryptoJS.AES.decrypt(data, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
});