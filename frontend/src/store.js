import { configureStore } from "@reduxjs/toolkit";
import authReducer from './Slices/authSlice';
import { apiSlice } from "./Slices/apiSlice";
import adminAuthSlice from './Slices/adminAuthSlice';
import { adminApiSlice } from './Slices/adminApiSlice'; // Import adminApi from adminApiSlice

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        adminAuth: adminAuthSlice,
        [adminApiSlice.reducerPath]: adminApiSlice.reducer, // Add adminApi reducer to the store
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(apiSlice.middleware, adminApiSlice.middleware), // Include adminApi middleware
    devTools: true
});

export default store;
