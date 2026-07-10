import axios from 'axios';
import { API_BASE_URL, TIMEOUT } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (status === 404) {
        return Promise.reject(new Error('Contact not found'));
      }
      if (status === 409) {
        return Promise.reject(new Error('Email already exists'));
      }
      if (status === 400) {
        return Promise.reject(new Error('Invalid data provided'));
      }
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export default api;
