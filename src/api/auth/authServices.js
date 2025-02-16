
import axiosInstance from "../axiosinstance";


const info = async (userData) => {
    const response = await axiosInstance.post("info")
    return response.data;
}

const login = async (data) => {
    const response = await axiosInstance.post("auth/login", data, { skipAuth: true });
    return response.data
}

const register = async (data) => {
    const response = await axiosInstance.post("auth/register", data, { skipAuth: true });
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
    register, login, logout, info, checkToken,
}
export default authService