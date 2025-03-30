import axiosInstance from "../axiosinstance";

// updateProfilImage sends a FormData via POST to "upload/profil/image"
const getUserProfile = async () => {
    const response = await axiosInstance.get("profile");
    return response.data;
}
// updateProfilImage sends a FormData via POST to "upload/profil/image"
const updateUserProfile = async (data) => {
    const response = await axiosInstance.put("profile", data);
    return response.data;
}

const profileService = {
    updateUserProfile,getUserProfile
}
export default profileService