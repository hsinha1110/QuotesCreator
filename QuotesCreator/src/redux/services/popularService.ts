import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';
import { PopularQuotesParams } from '@/types';

export const popularQuotesService = async (params: PopularQuotesParams) => {
  const url = SERVICE_ROUTES.POPULAR.replace(':language', params.language)
    .replace(':page', String(params.page))
    .replace(':limit', String(params.limit));

  console.log('POPULAR API URL:', url);

  const response = await api.get(url);

  return response.data;
};
