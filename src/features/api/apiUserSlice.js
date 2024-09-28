import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiUserSlice = createApi({
    reducerPath: "apiUser",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000"}),
    tagTypes: ["user"],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => "/currentUser",
            providesTags: ["user"]
        })
    })
})

export const { useGetUserQuery } = apiUserSlice