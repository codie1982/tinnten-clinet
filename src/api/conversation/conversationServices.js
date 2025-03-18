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
const answer = async (data) => {
    const response = await axiosInstance.put("conversation/answer",data)
    return response.data;
}
const deleteQuestion = async (id) => {
    const response = await axiosInstance.delete("conversation/question",{id})
    return response.data;
}
const conversationService = {
    create, conversation, history, detail,answer,deleteQuestion
}
export default conversationService