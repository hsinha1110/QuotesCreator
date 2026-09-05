import { createAsyncThunk } from '@reduxjs/toolkit';
import { getQuotesService } from '../services/quotesService';
import { ASYNC_ROUTES } from '../constants';
import { AppLanguage } from '@/language';
import { RootState } from '../store';

interface GetQuotesPayload {
  categoryId?: string;
  subcategoryId?: string;
  page?: number;
  limit?: number;
  language: AppLanguage;
}

export const getQuotesThunk = createAsyncThunk(
  ASYNC_ROUTES.QUOTES,

  async (
    {
      categoryId,
      subcategoryId,
      page = 1,
      limit = 10,
      language,
    }: GetQuotesPayload,
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;

      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await getQuotesService(token, {
        categoryId,
        subcategoryId,
        page,
        limit,
        language,
      });

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch quotes',
      );
    }
  },
);
