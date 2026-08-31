import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '../constants';

export const notificationsHistoryByIdService = async (
  token: string,
) => {
  const url = SERVICE_ROUTES.NOTIFICATION_HISTORY;

  console.log('🔔 Notifications History URL:', url);

  const response = await api.request({
    url,
    method: METHODS.GET,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};