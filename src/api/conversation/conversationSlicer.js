import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import conversationService from "./conversationServices"


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
export const deleteQuestion = createAsyncThunk(
    'conversation/deleteQuestion',
    async (id,thunkAPI) => {
        try {
            const response = await conversationService.deleteQuestion(id)
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
export const setAnswerToQuestion = createAsyncThunk(
    'conversation/answer',
    async (data,thunkAPI) => {
        try {
            const response = await conversationService.answer(data)
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
export const conversationDetail = createAsyncThunk(
    'conversation/detail',
    async (data, thunkAPI) => {
        try {
            console.log("conversation/detail", data)
            const response = await conversationService.detail(data)
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
export const conversation = createAsyncThunk(
    'conversation/chat',
    async (data, thunkAPI) => {
        try {
            const response = await conversationService.conversation(data)
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
        detail: null,
        human_message: null,
        system_message: null,
        recommendations: null,
        historyies: null,
        conversationid: null,
        conversationCreated:false,
        question:null,
        statusCode: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        deletedQuestionid:null,
        message: '',
    },
    reducers: {
        resetConversation: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.system_message = null
            state.data = null
            state.system_message = null

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
                state.conversationid = action.payload.data.conversationid
                state.conversationCreated = true;
            })
            .addCase(createconversation.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.conversationCreated = false;
            })
            .addCase(conversation.pending, (state) => {
                state.isLoading = true
            })
            .addCase(conversation.fulfilled, (state, action) => {
                console.log("conversation.fulfilled",action)
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.conversationCreated = false;
                state.conversationid = action.payload.data.conversation.conversationid
                state.system_message = action.payload.data.conversation
            })
            .addCase(conversation.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.system_message = null
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

            .addCase(conversationDetail.pending, (state) => {
                state.isLoading = true
            })
            .addCase(conversationDetail.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.conversationid = action.payload.data.conversation.conversationid
                state.system_message = action.payload.data.conversation
            })
            .addCase(conversationDetail.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.conversationCreated = false;
                state.conversationid = null
                state.system_message = null
            })
            .addCase(setAnswerToQuestion.pending, (state) => {
                state.isLoading = true
            })
            .addCase(setAnswerToQuestion.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.message = action.payload.message;
                state.question = action.payload.data.question;
            })
            .addCase(setAnswerToQuestion.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
            })
            .addCase(deleteQuestion.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.deletedQuestionid = action.payload.data.deleteid;
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
            })
    }
})


export const { resetConversation, resetHistory } = conversationSlice.actions
export default conversationSlice.reducer

