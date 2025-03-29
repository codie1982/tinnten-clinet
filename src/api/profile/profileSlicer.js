import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import updateUserProfile from '../profile/profileServices'
import { data } from "autoprefixer";
import profileService from "../profile/profileServices";

const initialState = {
    isLoading:null,
    isSuccess:null,
    isError:null,
    proile: null,
    message: '',
}




export const updateProfile = createAsyncThunk(
    'proile/update',
    async (data) => {
        try {
            return await profileService.updateUserProfile(data)
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

export const profileSlicer = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        resetUpload: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.proile = null
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.profile = action.payload.data?.profile
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.profile = null
            })
    }
})


export const { resetUpload } = profileSlicer.actions
export default profileSlicer.reducer

