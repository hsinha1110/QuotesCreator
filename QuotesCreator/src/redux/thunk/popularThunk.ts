import { LatestQuotesParams } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { latestQuotesService } from '../services/latestService';
import { ASYNC_ROUTES } from '../constants';
import { popularQuotesService } from '../services/popularService';

export const popularQuotesThunk = createAsyncThunk(
  ASYNC_ROUTES.POPULAR,
  async (params: LatestQuotesParams, { rejectWithValue }) => {
    try {
      const response = await popularQuotesService(params);
      console.log('🔥 POPULAR RESPONSE:', response);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch latest quotes',
      );
    }
  },
);
