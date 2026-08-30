import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';
import { categoriesParams } from '@/types';

export const categoriesService = async ({
  language,
  page,
  limit,
}: categoriesParams) => {
  try {
    const response = await api.get(SERVICE_ROUTES.CATEGORIES, {
      params: {
        language,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error: any) {
    console.log(
      'CATEGORIES SERVICE ERROR:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
