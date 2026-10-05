import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for sending/receiving cookies
});

export default api;
