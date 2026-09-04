import { SERVICE_ROUTES } from '../constants';
import api from '@/api/axiosinterceptors';

export const saveRecentQuoteService = async (
  quoteId: string,
  token: string,
) => {
  const response = await api.post(
    SERVICE_ROUTES.SAVE_RECENT_QUOTE,
    {
      quoteId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
};
