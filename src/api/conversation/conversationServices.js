import axiosInstance from "../axiosinstance";

const create = async () => {
    const response = await axiosInstance.post("conversation/create", {})
    return response.data;
}
const detail = async (data) => {
    const response = await axiosInstance.get("conversation/" + data.conversationid, {})
    return response.data;
}
const conversation = async (data) => {
    const response = await axiosInstance.post("conversation", data)
    return response.data;
}
const history = async () => {
    const response = await axiosInstance.get("conversation/historyies")
    return response.data;
}
const conversationService = {
    create, conversation, history, detail
}
export default conversationService