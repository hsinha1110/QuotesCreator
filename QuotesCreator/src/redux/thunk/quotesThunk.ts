import { createAsyncThunk } from '@reduxjs/toolkit';
import { getQuotesService } from '../services/quotesService';
import { GetQuotesParams } from '@/types';
import { ASYNC_ROUTES } from '../constants';

export const getQuotesAsyncThunk = createAsyncThunk(
  ASYNC_ROUTES.QUOTES,
  async (params: GetQuotesParams, { rejectWithValue }) => {
    try {
      const response = await getQuotesService(params);

      return response;
    } catch (error: any) {
      console.log('GET QUOTES THUNK ERROR:', error?.response?.data || error);

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch quotes',
      );
    }
  },
);
