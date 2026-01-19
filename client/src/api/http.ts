import axios from 'axios';
import { toastEvents } from '../lib/events';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor
http.interceptors.response.use(
  (response) => {
    // If our standardized response format is detected
    if (response.data && response.data.status) {
      if (response.data.status === 'success') {
        return response.data.data;
      }
      // If server returned status: 'error' but with 200 (rare but possible)
      const errorMsg = response.data.message || 'Operation failed';
      toastEvents.show(errorMsg, 'error');
      return Promise.reject(new Error(errorMsg));
    }
    return response.data;
  },
  (error) => {
    const apiError = error.response?.data;
    const message = apiError?.message || error.message || 'Something went wrong';
    
    // Only show toast if it's not a 401 (auth errors usually handled by login/middleware)
    if (error.response?.status !== 401) {
        toastEvents.show(message, 'error');
    }
    
    return Promise.reject(error);
  }
);
