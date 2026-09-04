import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';

export const deleteQuoteService = async (quoteId: string, token: string) => {
  const url = `${SERVICE_ROUTES.DELETE_QUOTE}/${quoteId}`;

  console.log('================================');
  console.log('🗑️ DELETE QUOTE');
  console.log('🗑️ URL:', url);
  console.log('🗑️ QUOTE ID:', quoteId);
  console.log('================================');

  const response = await api.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('🗑️ DELETE RESPONSE:', response.data);

  return response.data;
};
