import { LanguageState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppLanguage = 'English' | 'Hindi';

const initialState: LanguageState = {
  language: 'English',
  isLoading: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<AppLanguage>) => {
      state.language = action.payload;
    },

    clearLanguage: state => {
      state.language = 'English';
    },
  },
});

export const { setLanguage, clearLanguage } = languageSlice.actions;

export default languageSlice.reducer;
