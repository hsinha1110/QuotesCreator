import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '../constants';
import { RootState } from '../store';
import { getRecentQuotesService } from '../services/getRecentQuotesService';
import { AppLanguage } from '@/language';

export const getRecentQuotesThunk = createAsyncThunk(
  ASYNC_ROUTES.GET_RECENT_QUOTE,

  async (language: 'English' | 'Hindi', { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await getRecentQuotesService(token, language);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch recent quotes',
      );
    }
  },
);
