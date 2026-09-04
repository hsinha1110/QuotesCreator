//============ Async Routes ============================

export const ASYNC_ROUTES = {
  LOGIN: 'login',
  REGISTER: 'register',
  SOCIAL_LOGIN: 'socialLogin',
  CATEGORIES: 'categories',
  REGISTER_DEVICE: 'registerDevice',
  DAILY_NOTIFICATIONS: 'dailyNotifications',
  GET_NOTIFICATIONS: 'getNotifications',
  GET_UNREAD_COUNT: 'getUnreadCount',
  MARK_NOTIFICATION_AS_READ: 'markNotificationAsRead',
  MARK_ALL_NOTIFICATIONS_AS_READ: 'markAllNotificationsAsRead',
  DELETE_NOTIFICATION: 'deleteNotification',
  DAILY_QUOTE: 'dailyQuotes',
  ME: 'deleteMyAccount',
  LATEST: 'latestQuotes',
  POPULAR: 'popularQuotes',
  LIKE_QUOTES: 'like',
  UNLIKE_QUOTES: 'unlike',
  SUB_CATEGORIES: 'subCategories',
  QUOTES: 'quotes',
  NOTIFICATIONS_HISTORY_BY_ID: 'notificationsHistory',
  READ_NOTIFICATIONS: 'readNotifications',
  DELETE_NOTIFICATIONS: 'deleteNotifications',
  NOTIFICATIONS_SETTINGS: 'notificationsSettings',
  GET_PROFILE: 'getProfile',
  UPDATE_PROFILE: 'updateProfile',
  DELETE_ACCOUNT: 'deleteAccount',
  CREATE_QUOTE: 'createQuote',
  RECENT_QUOTE: 'recentQuote',
  SAVE_RECENT_QUOTE: 'saveRecentQuote',
  GET_RECENT_QUOTE: 'getRecentQuote',
  DELETE_QUOTE: 'deleteQuote',
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
