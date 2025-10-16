import axios from 'axios';

/**
 * Axios API client configured with base URL from environment.
 * Includes simple error handling and JSON defaults.
 */
const baseURL = process.env.REACT_APP_API_BASE || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor could add auth headers in future
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const formatted = {
      status: error.response?.status ?? null,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Request failed',
      details: error.response?.data?.details ?? null,
      data: error.response?.data ?? null,
    };
    return Promise.reject(formatted);
  }
);

export default apiClient;
