import { LatestQuotesParams } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { latestQuotesService } from '../services/latestService';
import { ASYNC_ROUTES } from '../constants';

export const latestQuotesThunk = createAsyncThunk(
  ASYNC_ROUTES.LATEST,
  async (params: LatestQuotesParams, { rejectWithValue }) => {
    try {
      const response = await latestQuotesService(params);
      console.log('🔥 LATEST RESPONSE:', response);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch latest quotes',
      );
    }
  },
);
