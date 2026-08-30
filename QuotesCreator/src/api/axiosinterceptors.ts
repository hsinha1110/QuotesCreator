import axios from 'axios';

import { API_BASE_URL } from '@/config/url';

const axiosInterceptor = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,

  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

axiosInterceptor.interceptors.request.use(
  config => {
    console.log(
      'REQUEST =>',
      config.method?.toUpperCase(),
      `${config.baseURL ?? ''}${config.url ?? ''}`,
      config.data ?? '',
    );

    return config;
  },

  error => {
    return Promise.reject(error);
  },
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

axiosInterceptor.interceptors.response.use(
  response => {
    console.log('RESPONSE =>', response.data);

    return response;
  },

  error => {
    console.log('API ERROR =>', error?.response?.data ?? error?.message);

    return Promise.reject(error);
  },
);

export default axiosInterceptor;
