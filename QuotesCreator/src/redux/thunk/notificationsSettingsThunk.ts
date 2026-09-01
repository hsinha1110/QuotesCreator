import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  NotificationSettingsData,
  notificationSettingsService,
} from '../services/notificationsSettingsService';
import { ASYNC_ROUTES } from '../constants';

export const notificationSettingsThunk = createAsyncThunk(
  ASYNC_ROUTES.NOTIFICATIONS_SETTINGS,

  async (data: NotificationSettingsData, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();

      const token = state.auth?.token;

      console.log('🔑 THUNK TOKEN:', token ? 'Available' : 'Missing');

      if (!token) {
        return rejectWithValue('Token not provided');
      }

      const response = await notificationSettingsService(data, token);

      return response;
    } catch (error: any) {
      console.log(
        '❌ Notification Settings Thunk Error:',
        error?.response?.data || error?.message,
      );

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update notification settings',
      );
    }
  },
);
