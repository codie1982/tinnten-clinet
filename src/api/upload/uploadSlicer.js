import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import uploadServices from './uploadServices'

const initialState = {};


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

export const uploadMultipleFile = createAsyncThunk(
    'upload/gallery',
    async ({ uploaderId, files }, { rejectWithValue }) => {
        try {
            const result = await uploadServices.uploadFile(files);
            return { uploaderId, result }; // fulfilled'de bu gelir
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message || error.toString();
            return rejectWithValue({ uploaderId, error: message });
        }
    }
);




export const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        resetUpload: (state, action) => {
            const uploaderId = action.payload;
            delete state[uploaderId];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadMultipleFile.pending, (state, action) => {
                const uploaderId = action.meta.arg.uploaderId;
                state[uploaderId] = {
                    isLoading: true,
                    isSuccess: false,
                    isError: false,
                    images: [],
                    files: [],
                    data: null
                };
            })
            .addCase(uploadMultipleFile.fulfilled, (state, action) => {
                const { uploaderId, result } = action.payload;
                state[uploaderId] = {
                    isLoading: false,
                    isSuccess: true,
                    isError: false,
                    images: result?.data?.successfullUploads || [],
                    files: result?.data?.successfullUploads || [],
                    data: result?.data,
                    successCount: result?.data?.successCount,
                    failureCount: result?.data?.failureCount,
                    totalFiles: result?.data?.totalFiles
                };
            })
            .addCase(uploadMultipleFile.rejected, (state, action) => {
                const { uploaderId, error } = action.payload || {};
                if (!uploaderId) return;

                state[uploaderId] = {
                    isLoading: false,
                    isSuccess: false,
                    isError: true,
                    images: [],
                    files: [],
                    error: error || action.error.message,
                    data: null
                };
            });
    }
})


export const { resetUpload } = uploadSlice.actions
export default uploadSlice.reducer

