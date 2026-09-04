import { createAsyncThunk } from '@reduxjs/toolkit';
import { ASYNC_ROUTES } from '../constants';
import { RootState } from '../store';
import { deleteQuoteService } from '../services/deleteQuoteService';

export const deleteQuoteThunk = createAsyncThunk(
  ASYNC_ROUTES.DELETE_QUOTE,
  async (quoteId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      return await deleteQuoteService(quoteId, token);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to delete quote',
      );
    }
  },
);
