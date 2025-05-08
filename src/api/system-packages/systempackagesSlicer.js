import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import systemPackagesService from "./systempackagesServices"



export const getuserpackages = createAsyncThunk(
    'systempackages/user',
    async (data, thunkAPI) => {
        try {
            return await systemPackagesService.getuserpackages()
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


export const getbuisnesspackages = createAsyncThunk(
    'systempackages/buisness',
    async (data, thunkAPI) => {
        try {
            return await systemPackagesService.getbuisnesspackages()
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


export const systemPackagesSlice = createSlice({
    name: 'systemPackages',
    initialState: {
        isError: false,
        isSuccess: false,
        isLoading: false,
        system_user_packages: null,
        system_buisness_packages: null,
        message: '',
    },
    reducers: {
        resetSystemPackages: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.system_user_packages = null
            state.system_buisness_packages = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getuserpackages.pending, (state) => {
                state.isConversationLoading = true
            })
            .addCase(getuserpackages.fulfilled, (state, action) => {
                state.isConversationLoading = false
                state.isSuccess = true
                state.isError = false
                state.system_user_packages = action.payload.data
            })
            .addCase(getuserpackages.rejected, (state, action) => {
                state.isConversationLoading = false
                state.isSuccess = false
                state.isError = true
                state.system_packages = null;
                state.message = action.payload.message
            })
            .addCase(getbuisnesspackages.pending, (state) => {
                state.isConversationLoading = true
            })
            .addCase(getbuisnesspackages.fulfilled, (state, action) => {
                state.isConversationLoading = false
                state.isSuccess = true
                state.isError = false
                state.system_buisness_packages = action.payload.data
            })
            .addCase(getbuisnesspackages.rejected, (state, action) => {
                state.isConversationLoading = false
                state.isSuccess = false
                state.isError = true
                state.system_packages = null;
                state.message = action.payload.message
            })
    }
})


export const { resetSystemPackages } = systemPackagesSlice.actions
export default systemPackagesSlice.reducer

