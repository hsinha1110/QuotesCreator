import api from '@/api/axiosinterceptors';
import { SERVICE_ROUTES } from '../constants';
import { UpdateProfileParams } from '@/types';

export const updateProfileService = async ({
  userId,
  name,
  email,
  profileImage,
}: UpdateProfileParams) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);

  if (profileImage?.uri) {
    formData.append('profileImage', {
      uri: profileImage.uri,
      type: profileImage.type || 'image/jpeg',
      name: profileImage.fileName || 'profile-image.jpg',
    } as any);
  }

  const response = await api.put(
    `${SERVICE_ROUTES.UPDATE_PROFILE}/${userId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  console.log('EDIT PROFILE RESPONSE:', response.data);

  return response.data;
};
