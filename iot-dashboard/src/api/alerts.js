import axios from './axios';

export const alertService = {
  getAllAlerts: async () => {
    const response = await axios.get('/alerts');
    return response.data.alerts; // CHÍNH XÁC để trả mảng về
  },  

  resolveAlert: async (alertId) => {
    const response = await axios.put(`/alerts/${alertId}/resolve`);
    return response.data;
  },

  deleteAlert: async (alertId) => {
    const response = await axios.delete(`/alerts/${alertId}`);
    return response.data;
  }
}; 