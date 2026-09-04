import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '../constants';
import { categoriesService } from '../services/categoriesService';

import { CategoriesParams } from '@/types';

export const categoriesThunk = createAsyncThunk(
  ASYNC_ROUTES.CATEGORIES,

  async (params: CategoriesParams, { rejectWithValue }) => {
    try {
      console.log('🚀 CATEGORIES THUNK PARAMS:', params);

      const response = await categoriesService(params);

      console.log('✅ CATEGORIES THUNK RESPONSE:', response);

      return response;
    } catch (error: any) {
      console.log(
        '❌ CATEGORIES THUNK ERROR:',
        error?.response?.data || error?.message,
      );

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch categories',
      );
    }
  },
);
