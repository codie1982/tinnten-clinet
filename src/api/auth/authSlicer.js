import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from './authServices'
//const user = JSON.parse(localStorage.getItem('user'))
//const url = JSON.parse(localStorage.getItem('url'))

const initialState = {
    url: null,
    data: null,
    statusCode: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
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
    async (thunkAPI) => {
        try {
            return await authService.googlelogin();
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
    async (token) => {
        try {
            return await authService.logout(token)
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
                state.data = action.payload.data.data
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.data = action.payload.data.data
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
                state.isLoading = true
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.isLogout = true
                state.statusCode = null
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.isLogout = false
                state.statusCode = null
            })
    }
})


export const { resetAuth } = authSlice.actions
export default authSlice.reducer

