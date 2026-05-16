import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle 401 Unauthorized errors - redirect to login
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.warn('Forbidden - insufficient permissions');
    }
    
    return Promise.reject(error);
  }
);

export default api;
