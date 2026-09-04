import api from '@/api/axiosinterceptors';

import { SERVICE_ROUTES } from '../constants';

export const deleteQuoteService = async (quoteId: string, token: string) => {
  const response = await api.delete(
    `${SERVICE_ROUTES.DELETE_QUOTE}/${quoteId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
