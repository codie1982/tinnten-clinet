import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../api/auth/authSlicer'
import uploadReducer from '../api/upload/uploadSlicer'
import profileReducer from '../api/profile/profileSlicer'
import productReducer from '../api/product/productSlicer'
import conversationReducer from '../api/conversation/conversationSlicer'
import systemPackagesReducer from '../api/system-packages/systempackagesSlicer'
import streamReducer from '../api/stream/streamSlicer'
import companysReducer from '../api/company/companySlicer'
import dynamicformReducer from '../api/form/dynamicFormSlicer'
import bidReducer from '../api/bid/bidSlicer'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        stream: streamReducer,
        profile: profileReducer,
        upload: uploadReducer,
        product: productReducer,
        conversation: conversationReducer,
        systempackages: systemPackagesReducer,
        company: companysReducer,
        dynamicform: dynamicformReducer,
        bid: bidReducer,
    }
})