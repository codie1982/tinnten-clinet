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
    const response = await axiosInstance.get("products/" + data.productid)
    return response.data;
}
const addProduct = async (data) => {
    const response = await axiosInstance.post("products", data)
    return response.data;
}

const productService = {
    addFavorite, getProductDetail, addProduct
}
export default productService