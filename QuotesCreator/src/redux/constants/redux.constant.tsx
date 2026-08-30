//============ Async Routes ============================

export const ASYNC_ROUTES = {
  // AUTH
  LOGIN: 'login',
  REGISTER: 'register',
  SOCIAL_LOGIN: 'socialLogin',

  CATEGORIES: 'categories',
  // NOTIFICATIONS
  REGISTER_DEVICE: 'registerDevice',
  DAILY_NOTIFICATIONS: 'dailyNotifications',
  GET_NOTIFICATIONS: 'getNotifications',
  GET_UNREAD_COUNT: 'getUnreadCount',
  MARK_NOTIFICATION_AS_READ: 'markNotificationAsRead',
  MARK_ALL_NOTIFICATIONS_AS_READ: 'markAllNotificationsAsRead',
  DELETE_NOTIFICATION: 'deleteNotification',
  ME: 'deleteMyAccount',
  LATEST: 'latestQuotes',
  POPULAR: 'popularQuotes',
  LIKE_QUOTES: 'like',
  UNLIKE_QUOTES: 'unlike',
} as const;

//==================== Thunk Status =====================

export const THUNK_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

//==================== Types =====================

export type AsyncRoutesType = (typeof ASYNC_ROUTES)[keyof typeof ASYNC_ROUTES];

export type ThunkStatusType = (typeof THUNK_STATUS)[keyof typeof THUNK_STATUS];
