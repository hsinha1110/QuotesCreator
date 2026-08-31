import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '../constants';

export const readNotificationsService = async (
  notificationId: string,
  token: string,
) => {
  const url = SERVICE_ROUTES.READ_NOTIFICATIONS.replace(':id', notificationId);

  const response = await api.request({
    url,
    method: METHODS.PUT,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
