import api from "../config/api";

export const getHealthCheckList = () => api.get('/health-check/get-list');
export const getHealthCheckById = (id) => api.get(`/health-check/get/${id}`);
export const createHealthCheck = (data) => api.post('/health-check/create', data);
export const updateHealthCheck = (id, data) => api.patch(`/health-check/update/${id}`, data);



