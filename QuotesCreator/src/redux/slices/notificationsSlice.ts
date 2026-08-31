import { createSlice } from '@reduxjs/toolkit';
import { dailyNotificationsThunk } from '../thunk/dailyNotificationsThunk';
import { NotificationState } from '@/types';
import { readNotificationsThunk } from '../thunk/readNotificationsThunk';
import { notificationHistoryByIdThunk } from '../thunk/notificationHistoryByIdThunk';

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

      // GET NOTIFICATIONS
      .addCase(notificationHistoryByIdThunk.pending, state => {
        state.isLoading = true;
      })

      .addCase(notificationHistoryByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.notifications = action.payload?.notifications || [];
      })

      .addCase(notificationHistoryByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // READ SINGLE NOTIFICATION
      .addCase(readNotificationsThunk.fulfilled, (state, action) => {
        const notificationId = action.meta.arg;

        state.notifications = state.notifications.map(notification =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        );
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
