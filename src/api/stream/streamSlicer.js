import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    data: null,
    isStreamError: false,
    isStreamSuccess: false,
    isStreamLoading: false,
    stream: '',
}
// FAKE Register user
export const stream = createAsyncThunk(
    'stream/message',
    async (data, thunkAPI) => {
        try {
            return data
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


export const streamSlicer = createSlice({
    name: 'stream',
    initialState,
    reducers: {
        resetStream: (state) => {
            state.isStreamLoading = false
            state.isStreamSuccess = false
            state.isStreamError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {

        builder
            .addCase(stream.fulfilled, (state, action) => {
                state.isStreamLoading = false
                state.isStreamSuccess = true
                state.isStreamError = false
                state.stream = action.payload
            })



    }
})


export const { resetStream } = streamSlicer.actions
export default streamSlicer.reducer

