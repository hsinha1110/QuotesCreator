import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';

export const getRecentQuotesService = async (
  language: 'English' | 'Hindi',
  token: string,
) => {
  const response = await api.get(
    `${SERVICE_ROUTES.GET_RECENT_QUOTE}?language=${language}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
