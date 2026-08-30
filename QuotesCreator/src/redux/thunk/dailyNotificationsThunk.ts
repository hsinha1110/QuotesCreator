import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '@/api/axiosinterceptors';

import { SERVICE_ROUTES, ASYNC_ROUTES } from '@/redux/constants';

export const dailyNotificationsThunk = createAsyncThunk(
  ASYNC_ROUTES.GET_NOTIFICATIONS,

  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('🔥 GET NOTIFICATIONS THUNK:', userId);

      const response = await api.get(
        `${SERVICE_ROUTES.NOTIFICATION_HISTORY}/${userId}`,
      );

      console.log('🔥 GET NOTIFICATIONS RESPONSE:', response.data);

      return response.data;
    } catch (error: any) {
      console.log(
        '❌ GET NOTIFICATIONS ERROR:',
        error?.response?.data || error,
      );

      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch notifications',
      );
    }
  },
);
