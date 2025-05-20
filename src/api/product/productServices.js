import axiosInstance from "../axiosinstance";

const addFavorite = async (userData) => {
    console.log("userData", userData)
    const response = { data: Math.random().toString(36).substring(2, 15) }

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

const getProductDetail = async (data) => {
    const response = await axiosInstance.get(`products/${data.productid}`)
    return response.data;
}

const addProduct = async (data) => {
    const response = await axiosInstance.post("products", data)
    return response.data;
}

const updateProduct = async ({ companyid, productid, payload }) => {
    const response = await axiosInstance.put(`products/${companyid}/${productid}`, payload)
    return response.data;
}

const updateProductPrice = async ({ companyid, productid, payload }) => {
    const response = await axiosInstance.put(`products/base-price/${companyid}/${productid}`, payload)
    return response.data;
}

const updateProductGallery = async ({ companyid, productid, payload }) => {
    const response = await axiosInstance.put(`products/gallery/${companyid}/${productid}`, payload)
    return response.data;
}

const updateProductVariants = async ({ companyid, productid, payload }) => {
    const response = await axiosInstance.put(`products/variants/${companyid}/${productid}`, payload)
    return response.data;
}

const updateProductRequestForm = async ({ companyid, productid, formid }) => {
    const response = await axiosInstance.put(`products/request-form/${companyid}/${productid}/${formid}`)
    return response.data;
}

const getProducts = async (data) => {
    const response = await axiosInstance.get(`products/${data.companyid}?page=${data.page}&limit=${data.limit}`)
    return response.data;
}

const getProductBase = async ({ companyid, productid }) => {
    const response = await axiosInstance.get(`products/base/${companyid}/${productid}`)
    return response.data;
}

const getProductPrice = async ({ companyid, productid }) => {
    const response = await axiosInstance.get(`products/base-price/${companyid}/${productid}`)
    return response.data;
}

const getProductGallery = async ({ companyid, productid }) => {
    const response = await axiosInstance.get(`products/gallery/${companyid}/${productid}`)
    return response.data;
}

const getProductVariants = async ({ companyid, productid }) => {
    const response = await axiosInstance.get(`products/variants/${companyid}/${productid}`)
    return response.data;
}

const deleteProduct = async ({ companyid, productid }) => {
    const response = await axiosInstance.delete(`products/${companyid}/${productid}`)
    return response.data;
}

const deleteProductVariants = async ({ companyid, productid }) => {
    const response = await axiosInstance.delete(`products/variants/${companyid}/${productid}`)
    return response.data;
}

const deleteProductGallery = async ({ companyid, productid }) => {
    const response = await axiosInstance.delete(`products/gallery/${companyid}/${productid}`)
    return response.data;
}

const deleteProductRequestForm = async ({ companyid, productid }) => {
    const response = await axiosInstance.delete(`products/request-form/${companyid}/${productid}`)
    return response.data;
}

const deleteProductBasePrice = async ({ companyid, productid }) => {
    const response = await axiosInstance.delete(`products/base-price/${companyid}/${productid}`)
    return response.data;
}

const deleteProductBasePriceItem = async ({ companyid, productid, priceid }) => {
    const response = await axiosInstance.delete(`products/base-price/${companyid}/${productid}/${priceid}`)
    return response.data;
}

const deleteImageFromGallery = async ({ companyid, productid, imageid }) => {
    const response = await axiosInstance.delete(`products/gallery/${companyid}/${productid}/image/${imageid}`)
    return response.data;
}

const productService = {
    addFavorite,
    getProductDetail,
    addProduct,
    getProducts,
    updateProduct,
    getProductBase,
    getProductPrice,
    updateProductPrice,
    getProductVariants,
    getProductGallery,
    updateProductGallery,
    updateProductVariants,
    updateProductRequestForm,
    deleteProduct,
    deleteProductVariants,
    deleteProductGallery,
    deleteProductRequestForm,
    deleteProductBasePrice,
    deleteProductBasePriceItem,
    deleteImageFromGallery
}

export default productService