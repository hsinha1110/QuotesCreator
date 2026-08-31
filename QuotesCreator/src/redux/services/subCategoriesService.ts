import api from '@/api/axiosinterceptors';

import { METHODS, SERVICE_ROUTES } from '../constants';

import { subCategoriesParams } from '@/types';

export const subCategoriesService = async ({
  categoryId,
  page = 1,
  limit = 10,
  language = 'English',
}: subCategoriesParams) => {
  const response = await api.request({
    method: METHODS.GET,
    url: SERVICE_ROUTES.SUB_CATEGORIES,
    params: {
      categoryId,
      page,
      limit,
      language,
    },
  });

  return response.data;
};
