import axios from './axios';

export const userService = {
  getAllUsers: async () => {
    const response = await axios.get('/users');
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axios.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(`/users/${userId}`);
    return response.data;
  }
}; 