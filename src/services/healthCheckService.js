import api from "../config/api";

export const getHealthCheckList = () => api.get('/health-check/get-list');
export const getHealthCheckById = (id) => api.get(`/health-check/get/${id}`);
export const getHealthCheckByBloodRegisterId = (bloodRegisterId) => api.get(`/health-check/get-by-register/${bloodRegisterId}`);
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
export const updateHealthCheck = (id, data) => api.patch(`/health-check/update/${id}`, data);



