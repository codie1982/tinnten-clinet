import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import systemPackagesService from "./systempackagesServices"



export const getuserpackages = createAsyncThunk(
    'systempackages/user',
    async (data, thunkAPI) => {
        return data
    }
)


export const getbuisnesspackages = createAsyncThunk(
    'systempackages/buisness',
    async (data, thunkAPI) => {
        return data
    }
)


export const systemPackagesSlice = createSlice({
    name: 'systemPackages',
    initialState: {
        isError: false,
        isSuccess: false,
        isLoading: false,
        system_packages: null,
        message: '',
    },
    reducers: {
        resetSystemPackages: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.system_packages = null
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
                state.system_packages = action.payload.data
            })
            .addCase(getuserpackages.rejected, (state, action) => {
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

