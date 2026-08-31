import { createAsyncThunk } from '@reduxjs/toolkit';
import { ASYNC_ROUTES } from '../constants';
import { RootState } from '../store';
import { notificationsHistoryByIdService } from '../services/notificationsHistoryByIdService';

export const notificationsHistoryThunk = createAsyncThunk(
  ASYNC_ROUTES.NOTIFICATIONS_HISTORY,

  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue(
          'Authentication token not found',
        );
      }

      const response =
        await notificationsHistoryService(token);

      return response;
    } catch (error: any) {
      console.log(
        '❌ Notifications History Error:',
        error?.response?.data || error,
      );

      return rejectWithValue(
        error?.response?.data?.message ||
          'Failed to get notifications',
      );
    }
  },
);