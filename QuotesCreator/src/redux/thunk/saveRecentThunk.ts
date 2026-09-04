import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '../constants';
import { RootState } from '../store';
import { saveRecentQuoteService } from '../services/saveRecentQuoteService';

export const saveRecentQuoteThunk = createAsyncThunk(
  ASYNC_ROUTES.SAVE_RECENT_QUOTE,

  async (quoteId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      if (!quoteId) {
        return rejectWithValue('Quote ID is required');
      }

      const response = await saveRecentQuoteService(quoteId, token);

      console.log(
        '✅ SAVE RECENT QUOTE RESPONSE:',
        JSON.stringify(response, null, 2),
      );

      return response;
    } catch (error: any) {
      console.log(
        '❌ SAVE RECENT QUOTE ERROR:',
        error?.response?.data || error,
      );

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to save recent quote',
      );
    }
  },
);
