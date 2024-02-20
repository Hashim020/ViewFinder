import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Slices/authSlice';
import { apiSlice } from "./Slices/apiSlice";
import adminAuthSlice from './Slices/adminAuthSlice'
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]:apiSlice.reducer,
        auth: authReducer,
        adminAuth:adminAuthSlice,
    },
    middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store;