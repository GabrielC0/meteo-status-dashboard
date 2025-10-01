import { configureStore } from '@reduxjs/toolkit';

import titanReducer from './titanSlice';

export const store = configureStore({
  reducer: {
    titan: titanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['titan/fetchAll/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
