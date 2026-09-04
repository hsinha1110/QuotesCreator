import api from '@/api/axiosinterceptors';
import { CreateQuotePayload } from '@/types';
import { SERVICE_ROUTES } from '../constants';

export const createQuoteService = async (
  payload: CreateQuotePayload,
  token: string,
) => {
  console.log('🔥 CREATE QUOTE PAYLOAD:', payload);
  console.log('🔥 TOKEN IN SERVICE:', token);

  const response = await api.post(SERVICE_ROUTES.CREATE_QUOTE, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log(
    '🔥 CREATE QUOTE RESPONSE:',
    JSON.stringify(response.data, null, 2),
  );

  return response.data;
};
