import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Locale = 'fr' | 'en' | 'es' | 'pt' | 'it';

interface LanguageState {
  currentLocale: Locale;
}

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

// Selectors
export const getCurrentLocale = (state: { language: LanguageState }) =>
  state.language.currentLocale;

export default languageSlice.reducer;
