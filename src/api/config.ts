// API base URL configuration - matching swipe-extension pattern
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:9000' 
  : 'https://app2.swipeswipe.co';

// Create axios instance with default config
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // To handle cookies for authentication if needed
  timeout: 5000, // Add reasonable timeout
});

// Add auth token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear token and redirect to login if needed
      localStorage.removeItem('token');
    }
    
    // Log connection errors for debugging
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.error('Connection error: Unable to reach the backend server');
    }
    
    return Promise.reject(error);
  }
);

export default api;