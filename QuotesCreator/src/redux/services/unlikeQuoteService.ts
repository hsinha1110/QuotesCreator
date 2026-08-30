import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '../constants';

export const unlikeQuoteService = async (quoteId: string, token: string) => {
  const url = SERVICE_ROUTES.UNLIKE_QUOTES.replace(':id', quoteId);

  const response = await api.request({
    url,
    method: METHODS.DELETE,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
