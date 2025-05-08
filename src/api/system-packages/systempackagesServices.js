import axiosInstance from "../axiosinstance";

const getuserpackages = async () => {
    const response = await axiosInstance.get("system-packages/user", {})
    return response.data;
}
const getbuisnesspackages = async () => {
    const response = await axiosInstance.get("system-packages/buisness", {})
    return response.data;
}
const systemPackagesService = {
    getuserpackages,getbuisnesspackages
}
export default systemPackagesService