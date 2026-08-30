import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '../constants';
import { likeQuoteService } from '../services/likeQuoteService';
import { RootState } from '../store';

export const likeQuoteThunk = createAsyncThunk(
  ASYNC_ROUTES.LIKE_QUOTES,
  async (quoteId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;

      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await likeQuoteService(quoteId, token);

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || 'Failed to like quote');
    }
  },
);
