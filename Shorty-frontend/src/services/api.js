import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shorty-1.onrender.com/api',
});

// Use an interceptor to add the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


export default api;