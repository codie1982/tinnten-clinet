import axiosInstance from "../axiosinstance";

// updateProfilImage sends a FormData via POST to "upload/profil/image"
const checkCompanySlug = async (data) => {
    const response = await axiosInstance.post("company/check/slug",data);
    return response.data;
}

const createCompany = async (data) => {
    const response = await axiosInstance.post("company/create",data);
    return response.data;
}


export default {
    checkCompanySlug,createCompany
}