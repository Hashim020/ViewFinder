import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ADMIN_URL = "/api/admin";

export const adminApiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: ADMIN_URL }),
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: "/auth",
        method: "POST",
        body: data,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getUserData: builder.mutation({
      query: (data) => ({
        url: "/get-user",
        method: "POST",
        body: data,
      }),
    }),
    
    // New endpoint for user block/unblock
    blockUnblockUser: builder.mutation({
      query: (data) => ({
        url: "/userBlockUnblock",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  reducer: adminApiReducer,
  middleware: adminApiMiddleware,
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useGetUserDataMutation,
  useBlockUnblockUserMutation,
} = adminApiSlice;
