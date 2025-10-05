import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LanguageState } from '@/types/Redux.types';

type Locale = 'fr' | 'en' | 'es' | 'pt' | 'it';

const initialState: LanguageState = {
  currentLocale: 'fr',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.currentLocale = action.payload;
    },
    clearLanguageData: (state) => {
      state.currentLocale = 'fr';
    },
  },
});

export const { setLocale, clearLanguageData } = languageSlice.actions;

export const getCurrentLocale = (state: { language: LanguageState }) =>
  state.language.currentLocale;

export default languageSlice.reducer;
