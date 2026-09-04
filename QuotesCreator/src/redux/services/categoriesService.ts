import api from '@/api/axiosinterceptors';

import { SERVICE_ROUTES } from '../constants';
import { CategoriesParams } from '@/types';

export const categoriesService = async ({
  language,
  page,
  limit,
}: CategoriesParams) => {
  try {
    console.log('🌐 CATEGORIES API PARAMS:', {
      language,
      page,
      limit,
    });

    const response = await api.get(SERVICE_ROUTES.CATEGORIES, {
      params: {
        language,
        page,
        limit,
      },
    });

    console.log('📦 CATEGORIES API RESPONSE:', response.data);

    return response.data;
  } catch (error: any) {
    console.log(
      '❌ CATEGORIES SERVICE ERROR:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
