import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';

export const deleteAccountService = async (userId: string, token: string) => {
  try {
    const response = await api.delete(
      `${SERVICE_ROUTES.DELETE_ACCOUNT}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
