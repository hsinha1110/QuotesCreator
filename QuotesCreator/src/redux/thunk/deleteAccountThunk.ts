import { createAsyncThunk } from '@reduxjs/toolkit';
import { ASYNC_ROUTES } from '../constants';
import { deleteAccountService } from '../services/deleteAccountService';

export const deleteAccountThunk = createAsyncThunk(
  ASYNC_ROUTES.DELETE_ACCOUNT,
  async (
    { userId, token }: { userId: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      return await deleteAccountService(userId, token);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to delete account',
      );
    }
  },
);
