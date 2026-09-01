import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '../constants';

export const notificationsHistoryByIdService = async (
  userId: string,
  token: string,
) => {
  if (!token) {
    throw new Error('Token not provided');
  }

  if (!userId) {
    throw new Error('User ID not provided');
  }

  const url = SERVICE_ROUTES.NOTIFICATION_HISTORY.replace(':userId', userId);

  console.log('🔔 Notifications History URL:', url);
  console.log('🔔 User ID:', userId);
  console.log('🔑 Token available:', !!token);

  const response = await api.request({
    url,
    method: METHODS.GET,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
