import { configureStore } from '@reduxjs/toolkit';

import titanReducer from './titanSlice';
import languageReducer from './languageSlice';
import loginReducer, { persistenceMiddleware } from '@/app/redux/reducers/loginRed';

export const store = configureStore({
  reducer: {
    titan: titanReducer,
    language: languageReducer,
    login: loginReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['titan/fetchAll/fulfilled'],
      },
    }).concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
