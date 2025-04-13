import axios from './axios';

export const authService = {
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to decode the token here to get user info
      // For now, we'll just return that we have a token
      return { isAuthenticated: true };
    }
    return { isAuthenticated: false };
  }
}; 