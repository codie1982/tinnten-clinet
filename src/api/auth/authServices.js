
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
    const response = await axiosInstance.post("auth/createurl", {}, { skipAuth: true });
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

    const response = await axiosInstance.post("auth/sendcode",data);
    return response.data
}
const verifymailcode = async (data) => {
    const response = await axiosInstance.post("auth/mailverify", data);
    return response.data
}

const logoutUser = async () => {
    try {
        console.log("logoutUser başladı");
        const response1 = await axiosInstance.post("info")
        console.log("logoutUser response1:", response1.data);

        const response = await axiosInstance.post(
            "auth/logout",
            {}, // boş body
            { skipAuth: true } // config: auth atlama
        );

        console.log("logoutUser response:", response.data);
        return response.data; // sadece backend'den dönen data
    } catch (error) {
        console.error("Logout işlemi başarısız:", error);
        throw error; // createAsyncThunk tarafı yakalayacak zaten
    }
};
const axiosTest = async () => {
    try {
        console.log("axiosInstance test başlıyor");
        const response = await axiosInstance.get("auth/test-endpoint", { skipAuth: true });
        console.log("axiosInstance test response:", response.data);
    } catch (error) {
        console.error("axiosInstance test error:", error);
    }
};

const checkToken = async () => {
    const response = await axiosInstance.get("auth/validate", {}, { skipAuth: true });
    return response.data
}

const authService = {
    register, login, googlelogin, createGoogleurl, logoutUser, axiosTest, info, checkToken, sendmailcode, verifymailcode
}
export default authService