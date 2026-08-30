import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';
import { LatestQuotesParams } from '@/types';

export const latestQuotesService = async ({
  language,
  page,
  limit,
}: LatestQuotesParams) => {
  try {
    const response = await api.get(SERVICE_ROUTES.LATEST, {
      params: {
        language,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error: any) {
    console.log(
      'LATEST QUOTES SERVICE ERROR:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
