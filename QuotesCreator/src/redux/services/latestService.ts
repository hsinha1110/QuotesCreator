import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';
import { LatestQuotesParams } from '@/types';

export const latestQuotesService = async ({
  language,
  page,
  limit,
}: LatestQuotesParams) => {
  try {
    console.log('🌐 SERVICE LANGUAGE:', language);

    const response = await api.get(SERVICE_ROUTES.LATEST, {
      params: {
        language,
        page,
        limit,
      },
    });

    console.log('🌐 SENT PARAMS:', {
      language,
      page,
      limit,
    });

    console.log(
      '🔥 API DISPLAY LANGUAGE:',
      response.data?.quotes?.[0]?.displayLanguage,
    );

    console.log(
      '🔥 API DISPLAY TEXT:',
      response.data?.quotes?.[0]?.displayText,
    );

    console.log(
      '🔥 API ORIGINAL LANGUAGE:',
      response.data?.quotes?.[0]?.language,
    );

    return response.data;
  } catch (error: any) {
    console.log(
      '❌ LATEST QUOTES SERVICE ERROR:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
