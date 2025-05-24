import axiosInstance from "../axiosinstance";

// 📌 Yeni form oluşturur
const addForm = async (data) => {
  const response = await axiosInstance.post("/forms", data);
  return response.data;
};

// 📌 Tüm formları getirir (kullanıcının erişebileceği)
const getForms = async ({ companyid }) => {
  const response = await axiosInstance.get(`/forms/${companyid}`);
  return response.data;
};

// 📌 Belirli bir formun detayını getirir
const getFormDetail = async ({ formid }) => {
  const response = await axiosInstance.get(`/forms/detail/${formid}`);
  return response.data;
};

// 📌 Belirli bir formu günceller
const updateForm = async ({ companyid, formid, payload: data }) => {
  const response = await axiosInstance.put(`/forms/${companyid}/${formid}`, data);
  return response.data;
};

// 📌 Belirli bir formu siler
const deleteForm = async ({ companyid, formid }) => {
  const response = await axiosInstance.delete(`/forms/${companyid}/${formid}`);
  return response.data;
};

// 📌 Belirli bir form alanını (field) günceller
const updateFormField = async ({ companyid, formid, fieldid, data }) => {
  const response = await axiosInstance.put(`/forms/${companyid}/${formid}/fields/${fieldid}`, data);
  return response.data;
};

// 📌 Belirli bir form alanını (field) siler
const deleteFormField = async ({ companyid, formid, fieldid }) => {
  const response = await axiosInstance.delete(`/forms/${companyid}/${formid}/fields/${fieldid}`);
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