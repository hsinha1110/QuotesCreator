import api from '@/api/axiosinterceptors';
import { AppLanguage } from '@/language';

interface GetQuotesParams {
  categoryId?: string;
  subcategoryId?: string;
  page?: number;
  limit?: number;
  language: AppLanguage;
}

export const getQuotesService = async (
  token: string,
  params: GetQuotesParams,
) => {
  const { categoryId, subcategoryId, page = 1, limit = 10, language } = params;

  const queryParams = new URLSearchParams();

  if (categoryId) {
    queryParams.append('categoryId', categoryId);
  }

  if (subcategoryId) {
    queryParams.append('subcategoryId', subcategoryId);
  }

  queryParams.append('page', String(page));
  queryParams.append('limit', String(limit));
  queryParams.append('language', language);

  const response = await api.get(`/api/quotes?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
