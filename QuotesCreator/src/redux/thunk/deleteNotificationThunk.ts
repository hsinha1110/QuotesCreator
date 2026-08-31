import { createAsyncThunk } from '@reduxjs/toolkit';

import { ASYNC_ROUTES } from '@/redux/constants';
import { RootState } from '@/redux/store';
import { deleteNotificationService } from '@/services/deleteNotificationService';

export const deleteNotificationThunk = createAsyncThunk(
  ASYNC_ROUTES.DELETE_NOTIFICATION,

  async (notificationId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;

      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      if (!notificationId) {
        return rejectWithValue('Notification ID not found');
      }

      console.log('🗑️ DELETE NOTIFICATION:', notificationId);

      const response = await deleteNotificationService(notificationId, token);

      console.log('✅ DELETE NOTIFICATION RESPONSE:', response);

      return response;
    } catch (error: any) {
      console.log(
        '❌ DELETE NOTIFICATION ERROR:',
        error?.response?.data || error,
      );

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to delete notification',
      );
    }
  },
);
