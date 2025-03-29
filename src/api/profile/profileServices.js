import axiosInstance from "../axiosinstance";

// updateProfilImage sends a FormData via POST to "upload/profil/image"
const updateUserProfile = async (data) => {
    const response = await axiosInstance.put("profile", data);
    return response.data;
}

const profileService = {
    updateUserProfile
}
export default profileService