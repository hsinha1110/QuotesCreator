export const API_BASE_URL = 'http://10.0.2.2:5001/';
export const getApiUrl = (endpoint: string) => API_BASE_URL + endpoint;

export const HOME = getApiUrl('/character');
