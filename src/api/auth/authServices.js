
import axiosInstance from "../axiosinstance";


const info = async (userData) => {
    const response = await axiosInstance.post("info")
    return response.data;
}

const login = async (data) => {
    const response = await axiosInstance.post("auth/login", data, { skipAuth: true });
    return response.data
}

const createGoogleurl = async () => {
    const response = await axiosInstance.post("auth/createurl");
    return response.data
}
const googlelogin = async (token) => {
    const response = await axiosInstance.post("auth/google/login", { token });
    return response.data
}

const register = async (data) => {
    const response = await axiosInstance.post("auth/register", data, { skipAuth: true });
    return response.data
}
const sendmailcode = async (data) => {
    const response = await axiosInstance.post("auth/sendcode");
    return response.data
}
const logout = async () => {
    const response = await axiosInstance.post("auth/logout");
    return response.data
}
const checkToken = async () => {
    const response = await axiosInstance.get("auth/validate");
    return response.data
}


const authService = {
    register, login, googlelogin, createGoogleurl, logout, info, checkToken, sendmailcode
}
export default authService