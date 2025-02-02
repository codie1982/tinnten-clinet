import axios from "axios";
const API_URL = "api/v10/users/"

const fakeRegister = async (userData) => {
    const response = { data: true }
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data
}
const fakeLogin = async (userData) => {
    const response = { data: true }
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data
}
const register = async (userData) => {
    const response = await axios.post(API_URL, userData);
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data
}
const logoutUser = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL + "logout", {}, config);
    return response.data
}
const registerWithGoogle = async () => {
    const response = await axios.post(API_URL + "google");
    if (response.data) {
        localStorage.setItem("url", JSON.stringify(response.data))
    }
    return response.data
}
const me = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const bodyParameters = {};
    const response = await axios.post(API_URL + "me",
        bodyParameters,
        config
    );

    return response.data
}
const authService = {
    fakeRegister,fakeLogin, register, registerWithGoogle, me, logoutUser
}
export default authService