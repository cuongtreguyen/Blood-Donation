import axios from 'axios';

const API_URL = '/health-check';

export const createHealthCheck = async (healthCheckData) => {
  const response = await axios.post(`${API_URL}/create`, healthCheckData);
  return response.data;
}; 