import api from '../config/api';

export const createHealthCheck = async (healthCheckData) => {
   const formattedData = {
      height: healthCheckData.height ? Number(healthCheckData.height) : 0,
      weight: healthCheckData.weight ? Number(healthCheckData.weight) : 0,
      temperature: healthCheckData.temperature ? Number(healthCheckData.temperature) : 0,
      bloodPressure: healthCheckData.bloodPressure ? Number(healthCheckData.bloodPressure) : 0,
      checkDate: healthCheckData.checkDate || new Date().toISOString().split('T')[0],
      status: healthCheckData.status === true || healthCheckData.status === 'true' || healthCheckData.status === 1,
      reason: healthCheckData.reason ? String(healthCheckData.reason).trim() : '',
      bloodRegisterId: Number(healthCheckData.bloodRegisterId)
    };
  const response = await api.post(`/health-check/create?height=${formattedData.height}&weight=${formattedData.weight}&temperature=${formattedData.temperature}&bloodPressure=${formattedData.bloodPressure}&checkDate=${formattedData.checkDate}&status=${formattedData.status}&reason=${formattedData.reason}&bloodRegisterId=${formattedData.bloodRegisterId}`, healthCheckData);
  return response.data;
};

export const getHealthCheckById = async (id) => {
  const response = await api.get(`/health-check/get/${id}`);
  return response.data;
}; 



