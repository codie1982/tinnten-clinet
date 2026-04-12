import axiosInstance from "../axiosinstance";

const listDocuments = async (params = {}) => {
  const response = await axiosInstance.get("content/documents", { params });
  return response.data;
};

const getDocumentDetail = async (id, params = {}) => {
  const response = await axiosInstance.get(`content/documents/${id}`, { params });
  return response.data;
};

const updateDocument = async (id, data) => {
  const response = await axiosInstance.patch(`content/documents/${id}`, data);
  return response.data;
};

const getDocumentLogs = async (id, params = {}) => {
  const response = await axiosInstance.get(`content/documents/${id}/logs`, { params });
  return response.data;
};

const getDocumentIndexStatus = async (id, params = {}) => {
  const response = await axiosInstance.get(`content/documents/${id}/index-status`, { params });
  return response.data;
};

// Bulk operations
const bulkIndexDocuments = async (data) => {
  const response = await axiosInstance.post("content/documents/bulk/index", data);
  return response.data;
};

const bulkDeindexDocuments = async (data) => {
  const response = await axiosInstance.post("content/documents/bulk/deindex", data);
  return response.data;
};

const bulkUpdateVisibility = async (data) => {
  const response = await axiosInstance.patch("content/documents/bulk/visibility", data);
  return response.data;
};

const bulkUpdateTags = async (data) => {
  const response = await axiosInstance.patch("content/documents/bulk/tags", data);
  return response.data;
};

const bulkMoveDocuments = async (data) => {
  const response = await axiosInstance.patch("content/documents/bulk/move", data);
  return response.data;
};

const bulkDeleteDocuments = async (data) => {
  const response = await axiosInstance.post("content/documents/bulk/delete", data);
  return response.data;
};

// Collections
const listCollections = async (params = {}) => {
  const response = await axiosInstance.get("content/collections", { params });
  return response.data;
};

const createCollection = async (data) => {
  const response = await axiosInstance.post("content/collections", data);
  return response.data;
};

const updateCollection = async (id, data) => {
  const response = await axiosInstance.patch(`content/collections/${id}`, data);
  return response.data;
};

const deleteCollection = async (id, params = {}) => {
  const response = await axiosInstance.delete(`content/collections/${id}`, { params });
  return response.data;
};

// File serving
const getFileRawUrl = (fileId) => {
  return `files/${fileId}/raw`;
};

const downloadFile = async (fileId) => {
  const response = await axiosInstance.get(`files/${fileId}/raw`, {
    responseType: "blob",
  });
  return response;
};

// Document upload
const uploadDocuments = async (formData) => {
  const response = await axiosInstance.post("upload/multiple/document", formData, {
    headers: { "Content-Type": undefined },
  });
  return response.data;
};

const importDocumentFromUrl = async (data) => {
  const response = await axiosInstance.post("upload/multiple/document/import", data);
  return response.data;
};

const contentService = {
  listDocuments,
  getDocumentDetail,
  updateDocument,
  getDocumentLogs,
  getDocumentIndexStatus,
  bulkIndexDocuments,
  bulkDeindexDocuments,
  bulkUpdateVisibility,
  bulkUpdateTags,
  bulkMoveDocuments,
  bulkDeleteDocuments,
  listCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  getFileRawUrl,
  downloadFile,
  uploadDocuments,
  importDocumentFromUrl,
};

export default contentService;
