import axiosInstance from "../axiosinstance";

const create = async () => {
    const response = await axiosInstance.post("conversation/create",{})
    return response.data;
}
const chat = async (data) => {
    const response = await axiosInstance.post("conversation/chat",data)
    return response.data;
}
const history = async () => {
    const response = await axiosInstance.get("conversation/historyies")
    return response.data;
}
const conversationService = {
    create,chat,history
}
export default conversationService