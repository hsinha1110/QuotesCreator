import { API_BASE_URL } from '../../config/url';

//================== SERVICE ROUTES =======================

export const SERVICE_ROUTES = {
  LOGIN: 'api/auth/login',
  REGISTER: 'api/auth/register',
  SOCIAL_LOGIN: 'api/auth/social-login',
  CATEGORIES: 'api/categories',
  // Notifications
  NOTIFICATIONS: 'api/notifications',
  DAILY_NOTIFICATIONS: 'api/notifications/history/:id',
  REGISTER_DEVICE: 'api/notifications/register-device',
  USER_DEVICES: 'api/notifications/user',
  DEACTIVATE_DEVICE: 'api/notifications/deactivate',
  SEND_NOTIFICATION: 'api/notifications/send',
  NOTIFICATION_HISTORY: 'api/notifications/history',
  NOTIFICATION_UNREAD_COUNT: 'api/notifications/unread-count',
  ME: 'api/users/me',
  MARK_ALL_NOTIFICATIONS_READ: 'api/notifications/read-all',
  LATEST: 'api/quotes/latest',
  POPULAR: 'api/quotes/popular',
  LIKE_QUOTES: 'api/quotes/:id/like',
  UNLIKE_QUOTES: 'api/quotes/:id/like',
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
