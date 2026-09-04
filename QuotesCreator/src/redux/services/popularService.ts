import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';
import { PopularQuotesParams } from '@/types';

export const popularQuotesService = async ({
  language,
  page,
  limit,
}: PopularQuotesParams) => {
  try {
    console.log('🌐 POPULAR SERVICE LANGUAGE:', language);

    const response = await api.get(SERVICE_ROUTES.POPULAR, {
      params: {
        language,
        page,
        limit,
      },
    });

    console.log('🌐 POPULAR SENT PARAMS:', {
      language,
      page,
      limit,
    });

    console.log(
      '🔥 POPULAR DISPLAY LANGUAGE:',
      response.data?.quotes?.[0]?.displayLanguage,
    );

    console.log(
      '🔥 POPULAR DISPLAY TEXT:',
      response.data?.quotes?.[0]?.displayText,
    );

    return response.data;
  } catch (error: any) {
    console.log(
      '❌ POPULAR QUOTES SERVICE ERROR:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
