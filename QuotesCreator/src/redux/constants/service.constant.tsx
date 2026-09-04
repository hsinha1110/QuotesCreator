import { API_BASE_URL } from '../../config/url';

//================== SERVICE ROUTES =======================

export const SERVICE_ROUTES = {
  LOGIN: 'api/auth/login',
  REGISTER: 'api/auth/register',
  SOCIAL_LOGIN: 'api/auth/social-login',
  CATEGORIES: 'api/categories',
  NOTIFICATIONS: 'api/notifications',
  REGISTER_DEVICE: 'api/notifications/register-device',
  USER_DEVICES: 'api/notifications/user/:userId',
  DEACTIVATE_DEVICE: 'api/notifications/deactivate',
  SEND_NOTIFICATION: 'api/notifications/send',
  NOTIFICATION_HISTORY: 'api/notifications/history/:userId',
  NOTIFICATION_UNREAD_COUNT: 'api/notifications/unread-count/:userId',
  MARK_ALL_NOTIFICATIONS_READ: 'api/notifications/read-all/:userId',
  READ_NOTIFICATIONS: 'api/notifications/:id/read',
  DELETE_NOTIFICATION: 'api/notifications/:id',
  DAILY_QUOTE: 'api/quotes/daily',
  LATEST: 'api/quotes/latest',
  POPULAR: 'api/quotes/popular',
  LIKE_QUOTES: 'api/quotes/:id/like',
  UNLIKE_QUOTES: 'api/quotes/:id/like',
  SUB_CATEGORIES: 'api/subcategories',
  QUOTES: 'api/quotes',
  NOTIFICATIONS_SETTINGS: 'api/notifications/notification-settings',
  GET_PROFILE: 'api/users',
  UPDATE_PROFILE: 'api/users',
  DELETE_ACCOUNT: 'api/users',
  CREATE_QUOTE: 'api/quotes',
  SAVE_RECENT_QUOTE: 'api/users/recent-quotes',
  GET_RECENT_QUOTE: 'api/users/recent-quotes',
  DELETE_QUOTE: 'api/quotes',
} as const;
//=================== METHODS ==============================

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
  PATCH: 'PATCH',
} as const;

export type MethodsType = (typeof METHODS)[keyof typeof METHODS];
export type ServiceRoutesType =
  (typeof SERVICE_ROUTES)[keyof typeof SERVICE_ROUTES];

export { API_BASE_URL };
