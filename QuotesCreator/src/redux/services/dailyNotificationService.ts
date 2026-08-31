import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '@/redux/constants';

export const dailyNotificationService = async (
  language: 'English' | 'Hindi' = 'English',
) => {
  const response = await api.get(
    `${SERVICE_ROUTES.DAILY_QUOTE}?language=${encodeURIComponent(language)}`,
  );

  return response.data;
};
