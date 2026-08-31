import { createAsyncThunk } from '@reduxjs/toolkit';
import { ASYNC_ROUTES } from '../constants';
import { RootState } from '../store';
import { readNotificationsService } from '../services/readNotificationsService';

export const readNotificationsThunk = createAsyncThunk(
  ASYNC_ROUTES.READ_NOTIFICATIONS,

  async (notificationId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      return await readNotificationsService(notificationId, token);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || 'Failed to mark notification as read',
      );
    }
  },
);
