import axios from './axios';

export const deviceService = {
  getAllDevices: async () => {
    const response = await axios.get('/devices');
    return response.data;
  },

  createDevice: async (deviceData) => {
    const response = await axios.post('/devices', deviceData);
    return response.data;
  },

  getDeviceById: async (deviceId) => {
    const response = await axios.get(`/devices/${deviceId}`);
    return response.data;
  },

  updateDevice: async (deviceId, deviceData) => {
    const response = await axios.put(`/devices/${deviceId}`, deviceData);
    return response.data;
  },

  deleteDevice: async (deviceId) => {
    const response = await axios.delete(`/devices/${deviceId}`);
    return response.data;
  },

  getDeviceReadings: async (deviceId) => {
    const response = await axios.get(`/devices/${deviceId}/readings`);
    return response.data;
  },

  getDeviceAlerts: async (deviceId) => {
    const response = await axios.get(`/devices/${deviceId}/alerts`);
    return response.data;
  }
}; 