import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosinterceptors';
import { PopularQuotesResponse } from '@/types';
import { ASYNC_ROUTES, SERVICE_ROUTES } from '../constants';

interface PopularParams {
  language: 'English' | 'Hindi';
  page: number;
  limit: number;
}

export const popularQuotesThunk = createAsyncThunk<
  PopularQuotesResponse,
  PopularParams
>(ASYNC_ROUTES.POPULAR, async (params, { rejectWithValue }) => {
  try {
    const url = SERVICE_ROUTES.POPULAR.replace(':language', params.language)
      .replace(':page', String(params.page))
      .replace(':limit', String(params.limit));

    const response = await api.get(url);

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data || error.message);
  }
});
