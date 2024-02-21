import { apiSlice } from './apiSlice';
const USER_URL = '/api/user';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/signup`,
                method: 'POST',
                body: data,
            }),
        }),
        RegisterOtpVarified: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/signup-verified`,
                method: 'POST',
                body: data,
            }),
        }),
        googleRegister: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/google-signup`,
                method: 'POST',
                body: data,
            }),
        }),
    })
})


export const {
    useLoginMutation,
    useRegisterMutation,
    useRegisterOtpVarifiedMutation,
    useGoogleRegisterMutation,
} = usersApiSlice;