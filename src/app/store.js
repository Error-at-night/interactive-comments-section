import { configureStore } from '@reduxjs/toolkit';
import { apiCommentSlice } from '../features/api/apiCommentsSlice';
import { apiUserSlice } from '../features/api/apiUserSlice';

export const store = configureStore({
  reducer: {
    [apiCommentSlice.reducerPath]: apiCommentSlice.reducer,
    [apiUserSlice.reducerPath]: apiUserSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiCommentSlice.middleware).concat(apiUserSlice.middleware),
});
