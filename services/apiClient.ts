import axios from 'axios';
import { base_url } from '@/utils/url';
import { getUserFromStorage } from '@/utils/getUserFromStorage';

const apiClient = axios.create({
  baseURL: base_url,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getUserFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Handle global error logging or 401 redirects here
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
