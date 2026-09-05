import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';
import { AppLanguage } from '@/language';

export const getRecentQuotesService = async (
  token: string,
  language: 'English' | 'Hindi',
) => {
  const response = await api.get(
    `${SERVICE_ROUTES.GET_RECENT_QUOTE}?language=${encodeURIComponent(
      language,
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
