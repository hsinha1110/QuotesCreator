import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ASYNC_ROUTES } from '../constants';
import { getRecentQuotesService } from '../services/getRecentQuoteService';

export const getRecentQuotesThunk = createAsyncThunk(
  ASYNC_ROUTES.GET_RECENT_QUOTE,

  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await getRecentQuotesService(token);

      return response;
    } catch (error: any) {
      console.log('GET RECENT QUOTES ERROR:', error?.response?.data || error);

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch recent quotes',
      );
    }
  },
);
