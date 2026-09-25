import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
});

// Attach JWT token & optional custom Gemini API Key automatically to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  const customKey = localStorage.getItem('gemini_api_key');

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  if (customKey && customKey.trim().length > 5) {
    req.headers['x-gemini-api-key'] = customKey.trim();
  }
  return req;
});

export default API;
