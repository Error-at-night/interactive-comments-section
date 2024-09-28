import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiCommentSlice = createApi({
    reducerPath: "apiComment",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000"}),
    tagTypes: ["comments"],
    endpoints: (builder) => ({
        getComments: builder.query({
          query: () => "/comments",
          transformResponse: (response) => {
            // Sort comments by score and replies by time
            return response.map((comment) => ({
              ...comment,
              replies: comment.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            })).sort((a, b) => b.score - a.score);
          },
          providesTags: ["comments"]
        }),
        // to add comment
        addComment: builder.mutation({
          query: (newComment) => ({
            url: '/comments',
            method: 'POST',
            body: newComment,
          }),
          invalidatesTags: ['comments']
        }),
        // to delete comment
        deleteComment: builder.mutation({
          query: (id) => ({
          url: `/comments/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ['comments']
        }),
        // to reply to a comment
        addReplyComment: builder.mutation({
          query: ({ id, replies }) => ({
          url: `/comments/${id}`,
          method: 'PATCH',
          body: { replies }
          }),
          invalidatesTags: ['comments']
        }),
        // to reply to a nested comment(reply)
        addReplyNestedComment: builder.mutation({
          query: ({ id, replies }) => ({
          url: `/comments/${id}`,
          method: 'PATCH',
          body: { replies }
          }),
          invalidatesTags: ['comments']
        }),
        // to delete a reply
        deleteReply: builder.mutation({
          query: ({ id, replies }) => ({
          url: `/comments/${id}`,
          method: "PATCH",
          body: { replies }
          }),
          invalidatesTags: ['comments']
        }),
        // to update comment
        updateComment: builder.mutation({
          query: ({ id, updatedContent }) => ({
            url: `/comments/${id}`,
            method: "PATCH",
            body: { content: updatedContent },
          }),
          invalidatesTags: ["comments"]
        }),
        // to update reply
        updateReply: builder.mutation({
          query: ({ id, replies }) => ({
            url: `/comments/${id}`,
            method: "PATCH",
            body: { replies },
          }),
          invalidatesTags: ["comments"]
        }),
        // to increase comment upvote
        updateCommentUpvote: builder.mutation({
          query: ({ id, updatedScore }) => ({
            url: `/comments/${id}`,
            method: "PATCH",
            body: { score: updatedScore },
          }),
          invalidatesTags: ["comments"]
        }),
        // to decrease comment downvote
        updateCommentDownvote: builder.mutation({
          query: ({ id, updatedScore }) => ({
            url: `/comments/${id}`,
            method: "PATCH",
            body: { score: updatedScore },
          }),
          invalidatesTags: ["comments"]
        }),
        // to increase reply upvote
        updateReplyUpvote: builder.mutation({
          query: ({ commentId, updatedScore }) => ({
            url: `/comments/${commentId}`,
            method: "PATCH",
            body: updatedScore,
          }),
          invalidatesTags: ["comments"]
        }),
        updateReplyDownvote: builder.mutation({
          query: ({ commentId, updatedScore }) => ({
            url: `/comments/${commentId}`,
            method: "PATCH",
            body: updatedScore,
          }),
          invalidatesTags: ["comments"]
        }),
    })
})

export const { 
  useGetCommentsQuery, 
  useAddCommentMutation, 
  useDeleteCommentMutation, 
  useAddReplyCommentMutation, 
  useAddReplyNestedCommentMutation, 
  useDeleteReplyMutation, 
  useUpdateCommentMutation,
  useUpdateReplyMutation, 
  useUpdateCommentUpvoteMutation, 
  useUpdateCommentDownvoteMutation,
  useUpdateReplyUpvoteMutation,
  useUpdateReplyDownvoteMutation,
} = apiCommentSlice