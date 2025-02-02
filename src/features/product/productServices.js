import axios from "axios";
const API_URL = "api/v10/products/"

const addFavorite = async (userData) => {
    console.log("userData", userData)
    const response = { data: Math.random().toString(36).substring(2, 15) }

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    console.log("response", response)
    return response.data
}
const productService = {
    addFavorite
}
export default productService