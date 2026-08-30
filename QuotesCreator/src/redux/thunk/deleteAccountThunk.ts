import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteAccountService } from '../services/deleteAccountService';
import { ASYNC_ROUTES } from '../constants';

export const deleteAccountThunk = createAsyncThunk(
  ASYNC_ROUTES.ME,
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteAccountService();

      console.log('DELETE ACCOUNT RESPONSE:', response);

      return response;
    } catch (error: any) {
      console.log('DELETE ACCOUNT ERROR:', error?.response?.data || error);

      return rejectWithValue(
        error?.response?.data || {
          success: false,
          message: 'Failed to delete account',
        },
      );
    }
  },
);
