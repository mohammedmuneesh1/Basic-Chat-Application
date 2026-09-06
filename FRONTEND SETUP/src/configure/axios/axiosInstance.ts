import axios from 'axios';



// Create Axios instance
const axiosInstance = axios.create({

  baseURL:import.meta.env.VITE_BACKEND_API_URL, // Replace with your API base URL
  // baseURL:'http://localhost:8080/' , // Replace with your API base URL
  timeout: 10000, // optional timeout
    withCredentials: true, // ✅ important
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {

    // const token = localStorage.getItem('token'); // Get token from localStorage
    // const token = Cookies.get("token");
    // console.log(`Bearer ${token}`)

    // config.headers['X-API-KEY'] = import.meta.env.VITE_BACKEND_KEY1;
    // config.headers['Content-Type'] = 'application/json';
    // if (token) {
    // }
      // config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // ✅ Response interceptor for 401 handling
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // If response is successful, just return it
//     return response;
//   },
//   (error) => {
//     // Handle 401 Unauthorized errors
//     if (error.response && error.response.status === 401) {
//       // Clear any auth-related cookies
//       Cookies.remove("token");
      
//       // Redirect to login
//       window.location.href = '/login';
//     }
    
//     return Promise.reject(error);
//   }
// );







export default axiosInstance;


