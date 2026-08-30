import api from '@/api/axiosinterceptors';
import { RegisterPayload } from '@/types';
import { SERVICE_ROUTES } from '../constants';

export const loginService = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post(SERVICE_ROUTES.REGISTER, data);

  return response.data;
};

export const registerService = async (data: RegisterPayload) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('confirmPassword', data.confirmPassword);

  if (data.profileImage) {
    formData.append('profileImage', {
      uri: data.profileImage.uri,
      type: data.profileImage.type,
      name: data.profileImage.name,
    } as any);
  }

  const response = await api.post(SERVICE_ROUTES.REGISTER, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
