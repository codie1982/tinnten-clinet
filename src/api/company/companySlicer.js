import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import companyServices from "../company/companyServices";

const initialState = {
    isCompanyLoading: null,
    isCompanySuccess: null,
    isCompanyError: null,
    isSlugLoading: null,
    isSlugSuccess: null,
    isSlugError: null,
    userProfile: null,
    buisnessProfile: null,
    message: '',
}




export const checkCompanySlug = createAsyncThunk(
    'company/checkslug',
    async (data) => {
        try {
            return await companyServices.checkCompanySlug(data)
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
export const createCompany = createAsyncThunk(
    'company/create',
    async (data) => {
        try {
            return await companyServices.createCompany(data)
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

export const companySlicer = createSlice({
    name: 'comapny',
    initialState,
    reducers: {
        resetUpload: (state) => {
            state.isCompanyLoading = false
            state.isCompanySuccess = false
            state.isCompanyError = false
            state.companyProfile = null
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkCompanySlug.pending, (state) => {
                state.isSlugLoading = true
            })
            .addCase(checkCompanySlug.fulfilled, (state, action) => {
                state.isSlugLoading = false
                state.isSlugSuccess = true
                state.isSlugError = false
            })
            .addCase(checkCompanySlug.rejected, (state, action) => {
                state.isSlugLoading = false
                state.isSuccess = false
                state.isError = true
            })

    }
})


export const { resetUpload } = companySlicer.actions
export default companySlicer.reducer

