import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from './authServices'
import { data } from "autoprefixer";

const initialState = {
    url: null,
    data: null,
    sendCode: false,
    mailverify: false,
    statusCode: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    isSendCodeLoading: false,
    isLogout: false,
    isValid: true,
    message: '',
}


export const login = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const googlelogin = createAsyncThunk(
    'auth/google/login',
    async (token, thunkAPI) => {
        try {
            return await authService.googlelogin(token);
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Register and Login user With Google 
export const createGoogleurl = createAsyncThunk(
    'auth/login/createurl',
    async (thunkAPI) => {
        try {
            return await authService.createGoogleurl();
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user)
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
// Register user
export const info = createAsyncThunk(
    'auth/info',
    async (thunkAPI) => {
        try {
            return await authService.info()
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
export const sendmailcode = createAsyncThunk(
    'auth/sendcode',
    async (thunkAPI) => {
        try {
            return await authService.sendmailcode()
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
export const verifymailcode = createAsyncThunk(
    'auth/verifymailcode',
    async (code,thunkAPI) => {
        try {
            console.log("code",code)
            return await authService.verifymailcode(code)
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
export const checkToken = createAsyncThunk(
    'auth/token',
    async (thunkAPI) => {
        try {
            return await authService.checkToken();
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);




// Logout user
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue })=> {
        try {console.log("logoutUser createAsyncThunk")
            return await authService.logoutUser()
        }  catch (error) {
            console.log("logoutUser error",error)
            const message = (error.response?.data?.message) || error.message || error.toString();
            return rejectWithValue(message); // ✅ HATA durumunda rejectWithValue kullanıyoruz
        }
    }
)
// Logout user
export const axiosTest = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue })=> {
        try {console.log("axiosTest axiosTest")
            return await authService.axiosTest()
        }  catch (error) {
            console.log("axiosTest error",error)
            const message = (error.response?.data?.message) || error.message || error.toString();
            return rejectWithValue(message); // ✅ HATA durumunda rejectWithValue kullanıyoruz
        }
    }
)
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = action.payload.data
                state.sendCode = action.payload.data.sendCode
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.data = action.payload.data
            })


            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.data = action.payload.data;
                state.sendCode = action.payload.data.sendCode
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.data = action.payload.data;
            })

            .addCase(googlelogin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(googlelogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.data = action.payload.data;
            })
            .addCase(googlelogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.data = action.payload.data;
                state.sendCode = action.payload.data.sendCode
            })
            .addCase(createGoogleurl.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(createGoogleurl.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.data = null
                state.url = action.payload.data.url
            })
            .addCase(createGoogleurl.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.isLogout = false
                state.statusCode = null
                state.data = null
                state.url = null
            })
            .addCase(logoutUser.pending, (state, action) => {
                console.log("logoutUser pending")
                state.isLoading = true
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                console.log("logoutUser fulfilled")
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.isLogout = true
                state.statusCode = null
                state.sendCode=false
                state.mailverify=false
                state.data = null
            })
            .addCase(logoutUser.rejected, (state, action) => {
                console.log("logoutUser rejected")
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.isLogout = false
                state.statusCode = null
                state.data = null
            })
            .addCase(sendmailcode.pending, (state, action) => {
                state.isSendCodeLoading = true
            })
            .addCase(sendmailcode.fulfilled, (state, action) => {
                state.isSendCodeLoading = false
                state.isSuccess = true
                state.isError = false
                state.sendCode = action.payload.data.sendcode
            })
            .addCase(sendmailcode.rejected, (state, action) => {
                state.isSendCodeLoading = false
                state.isSuccess = false
                state.isError = true
            })
            .addCase(verifymailcode.pending, (state, action) => {
                state.isSendCodeLoading = true
            })
            .addCase(verifymailcode.fulfilled, (state, action) => {
                state.isSendCodeLoading = false
                state.isSuccess = true
                state.isError = false
                state.mailverify = true
                state.message = action.payload.data.message
            })
            .addCase(verifymailcode.rejected, (state, action) => {
                state.isSendCodeLoading = false
                state.isSuccess = false
                state.isError = true
                state.sendCode = false
            })
    }
})


export const { resetAuth } = authSlice.actions
export default authSlice.reducer

