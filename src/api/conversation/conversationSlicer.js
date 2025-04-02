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
// conversation start user
export const conversationRename = createAsyncThunk(
    'conversation/rename',
    async (data,thunkAPI) => {
        try {
            const response = await conversationService.updateConversationTitle(data)
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
export const getConversationHistory = createAsyncThunk(
    'conversation/history/get',
    async (data,thunkAPI) => {
        try {
            const response = await conversationService.gethistories(data)
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
export const deleteConversationThunk = createAsyncThunk(
    'conversation/deleteconversition',
    async (data,thunkAPI) => {
        try {
            const response = await conversationService.remove(data)
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
export const searchConversationThunk = createAsyncThunk(
    'conversation/search',
    async (data,thunkAPI) => {
        try {
            const response = await conversationService.search(data)
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
        history: null,
        updateHistory:null,
        deleteHistory:null,
        conversationid: null,
        conversationCreated:false,
        question:null,
        statusCode: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        isHistoryError: false,
        isHistorySuccess: false,
        isHistoryLoading: false,
        deletedQuestionid:null,

        isSearchError: false,
        isSearchSuccess: false,
        isSearchLoading: false,
        searchResults:null,
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
            state.isHistoryLoading = false
            state.isHistorySuccess = false
            state.isHistoryError = false
            state.message = ''
            state.history = null
            state.updateHistory = null
            state.data = null
        },
        resetUpdateHistory: (state) => {
            state.isHistoryLoading = false
            state.isHistorySuccess = false
            state.isHistoryError = false
            state.message = ''
            state.updateHistory = null
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
            .addCase(getConversationHistory.pending, (state) => {
                state.isHistoryLoading = true
            })
            .addCase(getConversationHistory.fulfilled, (state, action) => {
                state.isHistoryLoading = false
                state.isHistorySuccess = true
                state.isHistoryError = false
                state.history = action.payload.data
            })
            .addCase(getConversationHistory.rejected, (state, action) => {
                state.isHistoryLoading = false
                state.isHistorySuccess = false
                state.isHistoryError = true
                state.history = null
            })


            .addCase(conversationRename.pending, (state) => {
                state.isHistoryLoading = true
            })
            .addCase(conversationRename.fulfilled, (state, action) => {
                state.isHistoryLoading = false
                state.isHistorySuccess = true
                state.isHistoryError = false
                state.updateHistory = action.payload.data
            })
            .addCase(conversationRename.rejected, (state, action) => {
                state.isHistoryLoading = false
                state.isHistorySuccess = false
                state.isHistoryError = true
                state.history = null
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

            .addCase(deleteConversationThunk.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteConversationThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.deleteHistory = action.payload.data
            })
            .addCase(deleteConversationThunk.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.deleteHistory = null
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
            .addCase(searchConversationThunk.pending, (state) => {
                state.isSearchLoading = true
            })
            .addCase(searchConversationThunk.fulfilled, (state, action) => {
                state.isSearchLoading = false
                state.isSearchSuccess = true
                state.isSearchError = false
                state.searchResults = action.payload.data.results;
            })
            .addCase(searchConversationThunk.rejected, (state, action) => {
                state.isSearchLoading = false
                state.isSearchSuccess = false
                state.isSearchError = true
            })
    }
})


export const { resetConversation, resetHistory,resetUpdateHistory } = conversationSlice.actions
export default conversationSlice.reducer

