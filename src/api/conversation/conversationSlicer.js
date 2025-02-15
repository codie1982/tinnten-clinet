import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import conversationService from "./conversationServices"
//const user = JSON.parse(localStorage.getItem('user'))
//const url = JSON.parse(localStorage.getItem('url'))


// conversation start user
export const createconversation = createAsyncThunk(
    'conversation/create',
    async (thunkAPI) => {
        try {
            const response = await conversationService.create()
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
// conversation send promt user
export const chat = createAsyncThunk(
    'conversation/chat',
    async (data, thunkAPI) => {
        try {
            const response = await conversationService.chat(data)
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
// conversation send promt user
export const conversationHistory = createAsyncThunk(
    'conversation/history',
    async (thunkAPI) => {
        try {
            const response = await conversationService.history()
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

// conversation send promt user
export const changeConversitionName = createAsyncThunk(
    'conversation/changename',
    async (thunkAPI) => {
        try {
            const response = await conversationService.history()
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

// conversation send promt user
export const deleteConversition = createAsyncThunk(
    'conversation/deleteconversition',
    async (thunkAPI) => {
        try {
            const response = await conversationService.history()
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
// conversation send promt user
export const deleteAllConversition = createAsyncThunk(
    'conversation/deleteallconversitions',
    async (thunkAPI) => {
        try {
            const response = await conversationService.history()
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


export const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        data: null,
        human_message: null,
        system_message: null,
        recommendations: null,
        historyies: null,
        statusCode: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: '',
    },
    reducers: {
        resetConversation: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.system_message = null
            state.data = null

        },
        resetHistory: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
            state.historyies = null
            state.data = null

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createconversation.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createconversation.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = action.payload.data
            })
            .addCase(createconversation.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
            })
            .addCase(chat.pending, (state) => {
                state.isLoading = true
            })
            .addCase(chat.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.system_message = action.payload.data.system_message
            })
            .addCase(chat.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.data = action.payload
            })
            .addCase(conversationHistory.pending, (state) => {
                state.isLoading = true
            })
            .addCase(conversationHistory.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.historyies = action.payload.data.historyies
            })
            .addCase(conversationHistory.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.historyies = null
            })

            .addCase(changeConversitionName.pending, (state) => {
                state.isLoading = true
            })
            .addCase(changeConversitionName.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = action.payload.data.historyies
            })
            .addCase(changeConversitionName.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.data = null
            })

            .addCase(deleteConversition.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteConversition.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = action.payload.data.historyies
            })
            .addCase(deleteConversition.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.data = null
            })

            .addCase(deleteAllConversition.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteAllConversition.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = action.payload.data.historyies
            })
            .addCase(deleteAllConversition.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.data = null
            })
    }
})


export const { resetConversation, resetHistory } = conversationSlice.actions
export default conversationSlice.reducer

