import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '../constants';

export interface NotificationSettingsData {
  dailyQuote: boolean;
  notificationTime: string;
  timezone: string;
}

export const notificationSettingsService = async (
  data: NotificationSettingsData,
  token: string,
) => {
  try {
    if (!token) {
      throw new Error('Token not provided');
    }

    const url = SERVICE_ROUTES.NOTIFICATIONS_SETTINGS;

    console.log('🔔 Notification Settings URL:', url);
    console.log('🔔 Notification Settings Data:', data);
    console.log('🔑 Token:', token ? 'Available' : 'Missing');

    const response = await api.request({
      url,
      method: METHODS.PUT,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data,
    });

    console.log('✅ Notification Settings Response:', response.data);

    return response.data;
  } catch (error: any) {
    console.log(
      '❌ Notification Settings Service Error:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
