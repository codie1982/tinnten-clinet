import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import uploadServices from './uploadServices'

const initialState = {
    isLoading: null,
    isSuccess: null,
    isError: null,
    image: null,
    data: null,
    message: '',
}


// Logout user
export const uploadprofileimage = createAsyncThunk(
    'upload/profile/image',
    async (files) => {
        try {
            return await uploadServices.updateProfilImage(files)
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return message
        }
    }
)

export const uploadMultipleImage = createAsyncThunk(
    'upload/gallery',
    async (files) => {
        try {
            return await uploadServices.uploadFile(files)
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()
            return message
        }
    }
)


export const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        resetUpload: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.images = null
            state.image = null
            state.data = null
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadprofileimage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(uploadprofileimage.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.image = action.payload.data?.image
            })
            .addCase(uploadprofileimage.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.image = null
            })

            .addCase(uploadMultipleImage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(uploadMultipleImage.fulfilled, (state, action) => {
                console.log("state, action", state, action)
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = action.payload.data
            })
            .addCase(uploadMultipleImage.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.data = null
            })
    }
})


export const { resetUpload } = uploadSlice.actions
export default uploadSlice.reducer

