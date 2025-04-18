import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productServices from "./productServices"

const initialState = {
    data: null,
    productData:null,
    isProductError: false,
    isProcudtSuccess: false,
    isProductLoading: false,
    message: '',
}
// FAKE Register user
export const addFavorite = createAsyncThunk(
    'product/addFavorite',
    async (user, thunkAPI) => {
        try {
            const response = await productServices.addFavorite(user)
            console.log("responseresponse", response)
            return response
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)


// FAKE Register user
export const getProductDetail = createAsyncThunk(
    'product/detail',
    async (data, thunkAPI) => {
        try {
            const response = await productServices.getProductDetail(data)
            return response
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const productSlicer = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetProduct: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {

        builder
            .addCase(addFavorite.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = action.payload
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.data = null
            })

            .addCase(getProductDetail.pending, (state) => {
                state.isProductLoading = true
            })
            .addCase(getProductDetail.fulfilled, (state, action) => {
                state.isProductLoading = false
                state.isProcudtSuccess = true
                state.isProductError = false
                state.productData = action.payload.data
            })
            .addCase(getProductDetail.rejected, (state, action) => {
                state.isLoading = false
                state.isProcudtSuccess = false
                state.isProductError = true
                state.productData = null
            })
    }
})


export const { resetProduct } = productSlicer.actions
export default productSlicer.reducer

