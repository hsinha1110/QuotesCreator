import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '../constants';
import { categoriesService } from '../services/categoriesService';

import { CategoriesParams } from '@/types';

export const categoriesThunk = createAsyncThunk(
  ASYNC_ROUTES.CATEGORIES,

  async (params: CategoriesParams, { rejectWithValue }) => {
    try {
      const response = await categoriesService(params);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch categories',
      );
    }
  },
);
