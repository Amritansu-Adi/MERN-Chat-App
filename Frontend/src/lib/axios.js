import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development'? "http://localhost:5000/api" : "/api", // Use the appropriate base URL for your environment
    withCredentials: true,                  // send cookies to server in every request
});