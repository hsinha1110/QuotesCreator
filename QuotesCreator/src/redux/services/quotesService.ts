import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '@/redux/constants';

export interface GetQuotesParams {
  categoryId?: string;
  subcategoryId?: string;
  page?: number;
  limit?: number;
  language?: 'English' | 'Hindi';
}

export const getQuotesService = async ({
  categoryId,
  subcategoryId,
  page = 1,
  limit = 10,
  language = 'English',
}: GetQuotesParams) => {
  try {
    console.log('GET QUOTES PARAMS:', {
      categoryId,
      subcategoryId,
      page,
      limit,
      language,
    });

    const response = await api.get(SERVICE_ROUTES.QUOTES, {
      params: {
        categoryId,
        ...(subcategoryId ? { subcategoryId } : {}),
        page,
        limit,
        language,
      },
    });

    console.log('GET QUOTES RESPONSE:', response.data);

    return response.data;
  } catch (error: any) {
    console.log('GET QUOTES SERVICE ERROR:', error?.response?.data || error);

    throw error;
  }
};
