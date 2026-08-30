import { createSlice } from '@reduxjs/toolkit';
import { dailyNotificationsThunk } from '../thunk/dailyNotificationsThunk';
import { NotificationState } from '@/types';

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',

  initialState,

  reducers: {
    clearNotifications: state => {
      state.notifications = [];
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(dailyNotificationsThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(dailyNotificationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.notifications = action.payload?.notifications || [];
      })

      .addCase(dailyNotificationsThunk.rejected, (state, action) => {
        state.isLoading = false;

        state.error =
          (action.payload as string) || 'Failed to fetch notifications';
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
