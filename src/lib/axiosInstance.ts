// axiosInstance.js or api.js
import axios from 'axios';

const baseURL=process.env.NEXT_PUBLIC_API_URL;
console.log("Base URL:", baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  
  }
});




// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
  
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven't already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        console.log("Refresh Token:", refreshToken);
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          {
            headers:{
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${refreshToken}`
            }
          }
         
        );

        const newAccessToken = response.data.access_token;

        // Save new token and update original request
        localStorage.setItem('access_token', newAccessToken);
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Optionally, redirect to login
        localStorage.clear()
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

