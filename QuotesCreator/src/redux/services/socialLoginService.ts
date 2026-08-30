import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';

export const socialLoginService = async (data: {
  firebaseUid: string;
  name: string;
  email: string;
  profileImage: string | null;
  provider: 'google' | 'facebook';
  language?: string;
}) => {
  try {
    console.log('🔥 SOCIAL LOGIN API REQUEST:', data);

    const response = await api.post(SERVICE_ROUTES.SOCIAL_LOGIN, {
      firebaseUid: data.firebaseUid,
      name: data.name,
      email: data.email,
      profileImage: data.profileImage,
      provider: data.provider,
      language: data.language ?? 'English',
    });

    console.log('🔥 SOCIAL LOGIN API RESPONSE:', response.data);

    return response.data;
  } catch (error: any) {
    console.log(
      '❌ SOCIAL LOGIN SERVICE ERROR:',
      error?.response?.data || error,
    );

    throw error;
  }
};
