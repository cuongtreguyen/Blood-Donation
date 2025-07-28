import api from "../config/api";

/**
 * Service xử lý các chức năng liên quan đến kiểm tra sức khỏe
 * Bao gồm lấy danh sách, lấy thông tin theo ID, tạo mới và cập nhật phiếu kiểm tra sức khỏe
 */

/**
 * Lấy danh sách tất cả phiếu kiểm tra sức khỏe
 * @returns {Promise<Object>} Danh sách phiếu kiểm tra sức khỏe
 */
export const getHealthCheckList = () => api.get('/health-check/get-list');
/**
 * Lấy thông tin phiếu kiểm tra sức khỏe theo ID
 * @param {number} id - ID của phiếu kiểm tra sức khỏe
 * @returns {Promise<Object>} Thông tin phiếu kiểm tra sức khỏe
 */
export const getHealthCheckById = (id) => api.get(`/health-check/get/${id}`);
/**
 * Lấy thông tin phiếu kiểm tra sức khỏe theo ID đăng ký hiến máu (hiện đang bị comment)
 * @param {number} bloodRegisterId - ID của đơn đăng ký hiến máu
 * @returns {Promise<Object>} Thông tin phiếu kiểm tra sức khỏe
 */
// export const getHealthCheckByBloodRegisterId = (bloodRegisterId) => api.get(`/health-check/get-by-register/${bloodRegisterId}`);
/**
 * Tạo mới phiếu kiểm tra sức khỏe
 * @param {Object} healthCheckData - Dữ liệu phiếu kiểm tra sức khỏe
 * @returns {Promise<Object>} Thông tin phiếu kiểm tra sức khỏe đã tạo
 */
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
/**
 * Cập nhật thông tin phiếu kiểm tra sức khỏe
 * @param {number} id - ID của phiếu kiểm tra sức khỏe
 * @param {Object} data - Dữ liệu cần cập nhật
 * @returns {Promise<Object>} Thông tin phiếu kiểm tra sức khỏe đã cập nhật
 */
export const updateHealthCheck = (id, data) => api.patch(`/health-check/update/${id}`, data);



