import { apiSlice } from "./apiSlice"

const ADMIN_URL="http://localhost:5000/api/admin"

export const admiApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({

        adminLogin:builder.mutation({
            query:(data)=>({
               url:`${ADMIN_URL}/auth` ,
               method:'POST',
               body:data
            })
        }),
        adminLogout:builder.mutation({
            query:()=>({
               url:`${ADMIN_URL}/logout` ,
               method:'POST',
            })
        }),
        adminUpdateUser:builder.mutation({
            query:(data)=>({
               url:`${ADMIN_URL}/update-user` ,
               method:'PUT',
               body:data
            })
        }),
        getUserData:builder.mutation({
            query:(data)=>({
               url:`${ADMIN_URL}/get-user` ,
               method:'POST',
            })
        }),
        deleteUserData:builder.mutation({
            query:(data)=>({
               url:`${ADMIN_URL}/delete-user` ,
               method:'DELETE',
               body:data
            })
        }),
        addNewUser:builder.mutation({
            query:(data)=>({
               url:`${ADMIN_URL}/add-user` ,
               method:'POST',
               body:data
            })
        })

    })
})

export const {useAdminLoginMutation,useAddNewUserMutation,useDeleteUserDataMutation,useAdminLogoutMutation,useAdminUpdateUserMutation,useGetUserDataMutation}= admiApiSlice