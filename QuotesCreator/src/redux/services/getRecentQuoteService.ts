import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';

export const getRecentQuotesService = async (token: string) => {
  const response = await api.get(SERVICE_ROUTES.GET_RECENT_QUOTE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
