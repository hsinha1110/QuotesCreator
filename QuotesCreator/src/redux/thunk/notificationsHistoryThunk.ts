import { createAsyncThunk } from '@reduxjs/toolkit';
import { ASYNC_ROUTES } from '../constants';
import { notificationsHistoryByIdService } from '../services/notificationsHistoryByIdService';

export const notificationsHistoryByIdThunk = createAsyncThunk(
  ASYNC_ROUTES.NOTIFICATIONS_HISTORY_BY_ID,
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();

      const userId = state.auth?.user?.id;
      const token = state.auth?.token;

      console.log('THUNK USER ID:', userId);
      console.log('THUNK TOKEN:', token ? 'AVAILABLE' : 'MISSING');

      if (!userId) {
        return rejectWithValue('User ID not found');
      }

      if (!token) {
        return rejectWithValue('Token not found');
      }

      const response = await notificationsHistoryByIdService(userId, token);

      return response;
    } catch (error: any) {
      console.log(
        'NOTIFICATION HISTORY ERROR:',
        error?.response?.data || error,
      );

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch notifications',
      );
    }
  },
);
