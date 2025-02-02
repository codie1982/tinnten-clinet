import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productServices from "../product/productServices"
//const user = JSON.parse(localStorage.getItem('user'))
//const url = JSON.parse(localStorage.getItem('url'))

const initialState = {
    data: null,
    statusCode: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}
// FAKE Register user
export const addFavorite = createAsyncThunk(
    'prıcudt/addFavorite',
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
                console.log("action.payload", action.payload)
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

    }
})


export const { resetProduct } = productSlicer.actions
export default productSlicer.reducer

