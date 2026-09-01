import { createAsyncThunk } from '@reduxjs/toolkit';
import { ASYNC_ROUTES } from '../constants';
import { dailyQuoteService } from '../services/dailyQuoteService';

export const dailyQuoteThunk = createAsyncThunk(
  ASYNC_ROUTES.DAILY_QUOTE,

  async (language: 'English' | 'Hindi', { rejectWithValue }) => {
    try {
      console.log('🔥 GET DAILY QUOTE');
      console.log('Language:', language);

      const response = await dailyQuoteService(language);

      console.log('🔥 DAILY QUOTE API RESPONSE:', response);

      return response;
    } catch (error: any) {
      console.log(
        '❌ DAILY QUOTE THUNK ERROR:',
        error?.response?.data || error?.message,
      );

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to get daily quote',
      );
    }
  },
);
