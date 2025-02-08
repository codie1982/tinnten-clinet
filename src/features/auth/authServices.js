import axios from "axios";
import axiosInstance from "../../api/axiosinstance";


const info = async (userData) => {
    console.log("userData", userData)
    const response = await axiosInstance.post("info")
    return response.data;
}

const login = async (data) => {
    const response = await axiosInstance.post("users/login", data, { skipAuth: true });
    return response.data
}

const register = async (data) => {
    const response = await axiosInstance.post("users/register", data, { skipAuth: true });
    return response.data
}
const logout = async () => {
    const response = await axiosInstance.post("users/logout");
    return response.data
}
const checkSession = async () => {
    const response = await axiosInstance.post("users/checksession");
    return response.data
}


const authService = {
    register, login, logout, info, checkSession,
}
export default authService