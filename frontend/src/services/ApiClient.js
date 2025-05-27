import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Your backend API base URL
  // You can add other default settings here, like headers or timeout
});

// Request Interceptor
// This function will be called before every request is sent using this apiClient instance
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (can be useful for global error handling, like 401s)
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // You could globally handle 401 errors here (e.g., by logging out the user)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - 401. Redirecting to login or logging out.");
      // Example: localStorage.removeItem('authToken');
      // Example: window.location.href = '/login'; // Or use navigate from react-router-dom if context is available
    }
    return Promise.reject(error);
  }
);


export default apiClient;