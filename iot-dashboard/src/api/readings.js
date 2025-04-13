import axios from './axios';

export const readingService = {
  getAllReadings: async () => {
    const response = await axios.get('/readings');
    return response.data;
  },

  createReading: async (readingData) => {
    const response = await axios.post('/readings', readingData);
    return response.data;
  }
}; 