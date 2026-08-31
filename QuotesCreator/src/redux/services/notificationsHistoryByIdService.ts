import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '../constants';

export const notificationsHistoryByIdService = async (
  userId: string,
  token: string,
) => {
  const url = SERVICE_ROUTES.NOTIFICATION_HISTORY.replace(':userId', userId);

  console.log('🔔 Notifications History URL:', url);
  console.log('🔔 User ID:', userId);

  const response = await api.request({
    url,
    method: METHODS.GET,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
