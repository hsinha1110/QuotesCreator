import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';

export const deleteAccountService = async () => {
  const response = await api.request({
    url: SERVICE_ROUTES.ME,
    method: 'DELETE',
  });

  return response.data;
};
