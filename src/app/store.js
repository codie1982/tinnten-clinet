import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../api/auth/authSlicer'
import productReducer from '../api/product/productSlicer'
import conversationReducer from '../api/conversation/conversationSlicer'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        conversation: conversationReducer,
    }
})