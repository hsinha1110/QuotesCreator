import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateQuotePayload } from '@/types';
import { ASYNC_ROUTES } from '../constants';
import { RootState } from '../store';
import { createQuoteService } from '../services/createQuoteService';
export const createQuoteThunk = createAsyncThunk(
  ASYNC_ROUTES.CREATE_QUOTE,
  async (payload: CreateQuotePayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await createQuoteService(payload, token);

      return response;
    } catch (error: any) {
      console.log('CREATE QUOTE ERROR:', error?.response?.data || error);

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to create quote',
      );
    }
  },
);
