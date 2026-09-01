import api from '@/api/axiosinterceptors';
import { METHODS, SERVICE_ROUTES } from '../constants';
import { RegisterDeviceData } from '@/types';

export const registerDeviceService = async (
  data: RegisterDeviceData,
  token: string,
) => {
  try {
    if (!token) {
      throw new Error('Token not provided');
    }

    console.log('📱 Register Device Data:', data);
    console.log('🔑 Token:', token ? 'Available' : 'Missing');

    const response = await api.request({
      url: SERVICE_ROUTES.REGISTER_DEVICE,
      method: METHODS.POST,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data,
    });

    console.log('✅ Register Device Response:', response.data);

    return response.data;
  } catch (error: any) {
    console.log(
      '❌ Register Device Service Error:',
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
