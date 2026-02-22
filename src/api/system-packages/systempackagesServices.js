import axiosInstance from "../axiosinstance";

const getuserpackages = async () => {
    const response = await axiosInstance.get("system-packages/user", {})
    return response.data;
}
const getBusinessPackages = async () => {
    const response = await axiosInstance.get("system-packages/business", {})
    return response.data;
}
const systemPackagesService = {
    getuserpackages, getBusinessPackages
}
export default systemPackagesService