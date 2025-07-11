import api from '../config/api';

export const createHealthCheck = async (healthCheckData) => {
  const response = await api.post('/health-check/create', healthCheckData);
  return response.data;
};

export const getHealthCheckById = async (id) => {
  const response = await api.get(`/health-check/get/${id}`);
  return response.data;
}; 