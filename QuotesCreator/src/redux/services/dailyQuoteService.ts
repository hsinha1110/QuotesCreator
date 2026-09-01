import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '../constants';

export const dailyQuoteService = async (language: 'English' | 'Hindi') => {
  try {
    const response = await api.request({
      url: SERVICE_ROUTES.DAILY_QUOTE,
      method: METHODS.GET,
      params: {
        language,
      },
    });

    console.log('✅ DAILY QUOTE SERVICE RESPONSE:', response.data);

    return response.data;
  } catch (error: any) {
    console.log(
      '❌ DAILY QUOTE SERVICE ERROR:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
