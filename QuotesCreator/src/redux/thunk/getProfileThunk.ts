import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '../constants';
import { getProfileService } from '../services/getProfileService';

export const getProfileThunk = createAsyncThunk(
  ASYNC_ROUTES.GET_PROFILE,

  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getProfileService(userId);
      console.log(response, '......get Profile response');
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch profile',
      );
    }
  },
);
