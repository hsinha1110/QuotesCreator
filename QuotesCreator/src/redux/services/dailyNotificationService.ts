import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '@/redux/constants';

// ==========================================
// GET DAILY QUOTE
// ==========================================

export const getDailyQuoteService = async (
  language: 'English' | 'Hindi' = 'English',
) => {
  try {
    console.log('DAILY QUOTE SERVICE:', language);

    const response = await api.get(
      `${SERVICE_ROUTES.DAILY_NOTIFICATIONS}?language=${encodeURIComponent(
        language,
      )}`,
    );

    console.log('DAILY QUOTE RESPONSE:', response.data);

    return response.data;
  } catch (error: any) {
    console.log(
      'DAILY QUOTE SERVICE ERROR:',
      error?.response?.data || error?.message || error,
    );

    throw error;
  }
};
