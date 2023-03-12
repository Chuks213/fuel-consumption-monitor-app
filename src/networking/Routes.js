// const server_url = "http://192.168.0.151:9004";// DEV
const server_url = "https://fuel-consumption-monitor-app.herokuapp.com"// PROD
const server_port = ""
const api_path = "/api";

// User Routes
export const loginUrl = server_url + server_port + api_path + "/login";
export const forgotPasswordUrl = server_url + server_port + api_path + "/user/forgot-password";
export const userRegistrationUrl = server_url + server_port + api_path + "/user/sign-up";
export const getUserDetailsUrl = server_url + server_port + api_path + "/user/get-current-user-details";
export const validateConfirmationCodeUrl = server_url + server_port + api_path + "/user/validate-confirmation-code";
export const resetPasswordUrl = server_url + server_port + api_path + "/user/password-reset";
export const editProfileUrl = server_url + server_port + api_path + "/user/edit-profile";


// Trip Routes
export const startTripUrl = server_url + server_port + api_path + "/trip/start";
export const endTripUrl = server_url + server_port + api_path + "/trip/end";
export const recordTripInformationUrl = server_url + server_port + api_path + "/trip/record-information";
export const recordBulkTripInformationUrl = server_url + server_port + api_path + "/trip/record-bulk-information";
export const getLastTripInformationUrl = server_url + server_port + api_path + "/trip/get-last-trip-information";


// Configuration Routes
export const getConfigurationUrl = server_url + server_port + api_path + "/configuration/fetch";
export const updateConfigurationUrl = server_url + server_port + api_path + "/configuration/create-or-update";