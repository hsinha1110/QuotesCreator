import { createAsyncThunk } from '@reduxjs/toolkit';

import { subCategoriesParams } from '@/types';

import { subCategoriesService } from '../services/subCategoriesService';

import { ASYNC_ROUTES } from '../constants';

export const subCategoriesThunk = createAsyncThunk(
  ASYNC_ROUTES.SUB_CATEGORIES,

  async (params: subCategoriesParams, { rejectWithValue }) => {
    try {
      const response = await subCategoriesService(params);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch subcategories',
      );
    }
  },
);
