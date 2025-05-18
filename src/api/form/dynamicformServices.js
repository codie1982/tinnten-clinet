import axiosInstance from "../axiosinstance";

// 📌 Yeni form oluşturur
const addForm = async (data) => {
  const response = await axiosInstance.post("/forms", data);
  return response.data;
};

// 📌 Tüm formları getirir (kullanıcının erişebileceği)
const getForms = async ({companyid}) => {
  const response = await axiosInstance.get(`/forms/${companyid}`);
  return response.data;
};

// 📌 Belirli bir formun detayını getirir
const getFormDetail = async (formid) => {
  const response = await axiosInstance.get(`/forms/${formid}`);
  return response.data;
};

// 📌 Belirli bir formu günceller
const updateForm = async (formid, data) => {
  const response = await axiosInstance.put(`/forms/${formid}`, data);
  return response.data;
};

// 📌 Belirli bir formu siler
const deleteForm = async (formid) => {
  const response = await axiosInstance.delete(`/forms/${formid}`);
  return response.data;
};

// 📌 Belirli bir form alanını (field) günceller
const updateFormField = async (formid, fieldid, data) => {
  const response = await axiosInstance.put(`/forms/${formid}/fields/${fieldid}`, data);
  return response.data;
};

// 📌 Belirli bir form alanını (field) siler
const deleteFormField = async (formid, fieldid) => {
  const response = await axiosInstance.delete(`/forms/${formid}/fields/${fieldid}`);
  return response.data;
};

export default {
  addForm,
  getForms,
  getFormDetail,
  updateForm,
  deleteForm,
  updateFormField,
  deleteFormField,
};