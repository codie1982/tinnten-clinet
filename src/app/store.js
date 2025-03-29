import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../api/auth/authSlicer'
import uploadReducer from '../api/upload/uploadSlicer'
import profileReducer from '../api/profile/profileSlicer'
import productReducer from '../api/product/productSlicer'
import conversationReducer from '../api/conversation/conversationSlicer'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        upload: uploadReducer,
        product: productReducer,
        conversation: conversationReducer,
    }
})