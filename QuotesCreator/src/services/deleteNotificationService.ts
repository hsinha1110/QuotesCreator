import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '@/redux/constants';

export const deleteNotificationService = async (
  notificationId: string,
  token: string,
) => {
  const url = SERVICE_ROUTES.DELETE_NOTIFICATION.replace(':id', notificationId);

  console.log('🗑️ DELETE NOTIFICATION URL:', url);
  console.log('🗑️ NOTIFICATION ID:', notificationId);

  const response = await api.request({
    url,
    method: METHODS.DELETE,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
