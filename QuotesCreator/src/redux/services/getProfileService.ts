import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';

export const getProfileService = async (userId: string) => {
  try {
    const response = await api.get(`${SERVICE_ROUTES.GET_PROFILE}/${userId}`);
    console.log(response, '.......get profile service');
    return response.data;
  } catch (error) {
    throw error;
  }
};
