import axiosInstance from "../axiosinstance";

// updateProfilImage sends a FormData via POST to "upload/profil/image"
const updateProfilImage = async (files) => {
    const response = await axiosInstance.post("upload/profil/image", files,{
        headers: {
            'Content-Type': undefined, // Veya hiç yazma
        },
    });
    return response.data;
}

const uploadFile = async (files) => {
    const response = await axiosInstance.post("upload/multiple", files,{
        headers: {
            'Content-Type': undefined, // Veya hiç yazma
        },
    });
    return response.data;
}

const uploadService = {
    updateProfilImage,uploadFile
}
export default uploadService