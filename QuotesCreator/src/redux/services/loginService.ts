import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';
import { LoginPayload } from '@/types';

export const loginService = async (data: LoginPayload) => {
  const response = await api.post(SERVICE_ROUTES.LOGIN, data);

  return response.data;
};
