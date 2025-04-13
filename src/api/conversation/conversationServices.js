import axiosInstance from "../axiosinstance";

const create = async () => {
    const response = await axiosInstance.post("conversation/create", {})
    return response.data;
}
const updateConversationTitle = async (data) => {
    const response = await axiosInstance.put("conversation/title", data)
    return response.data;
}
const detail = async (data) => {
    const response = await axiosInstance.get("conversation/" + data.conversationid, {})
    return response.data;
}
const remove = async (data) => {
    const response = await axiosInstance.delete("conversation/?conversationid=" + data.conversationid, {})
    return response.data;
}
const search = async (data) => {
    const response = await axiosInstance.get(`conversation/search/?q=${data.query}&p=${data.page}&l=${data.limit}`, {})
    return response.data;
}
const conversation = async (data) => {
    console.log("data", data)
    const response = await axiosInstance.post("conversation", data)
    return response.data;
}
const gethistories = async (data) => {
    const response = await axiosInstance.get(`conversation/historyies?page=${data.page}&limit=${data.limit}`, {})
    return response.data;
}
const answer = async (data) => {
    const response = await axiosInstance.put("conversation/answer", data)
    return response.data;
}
const deleteQuestion = async (id) => {
    const response = await axiosInstance.delete("conversation/question", { id })
    return response.data;
}
const conversationService = {
    create, search, remove, conversation, updateConversationTitle, gethistories, detail, answer, deleteQuestion
}
export default conversationService