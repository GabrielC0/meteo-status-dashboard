import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Locale } from '@/i18n/messages';

type LanguageState = {
  locale: Locale | null;
};

const initialState: LanguageState = {
  locale: null,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
    clearLanguageData: (state) => {
      state.locale = null;
    },
  },
});

export const { setLocale, clearLanguageData } = languageSlice.actions;

export const getCurrentLocale = (state: { language: LanguageState }): Locale | null =>
  state.language.locale;

export default languageSlice.reducer;
