import axiosInstance from "../axiosinstance";

// 📌 Yeni form oluşturur
const expand = async (data) => {
  const response = await axiosInstance.post("/bid-request/expand", data);
  return response.data;
};
const search = async (data) => {
  const response = await axiosInstance.post("/bid-request/search", data);
  return response.data;
};



export default {
  expand, search,
};