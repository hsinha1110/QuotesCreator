import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '../constants';
import { updateProfileService } from '../services/updateProfileService';
import { UpdateProfileParams } from '@/types';

export const updateProfileThunk = createAsyncThunk(
  ASYNC_ROUTES.UPDATE_PROFILE,

  async (params: UpdateProfileParams, { rejectWithValue }) => {
    try {
      const response = await updateProfileService(params);

      return response;
    } catch (error: any) {
      console.log('EDIT PROFILE ERROR:', error?.response?.data || error);

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to update profile',
      );
    }
  },
);
