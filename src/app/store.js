import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlicer'
import productReducer from '../features/product/productSlicer'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
    }
})