import api from '../config/api';

/**
 * Service xử lý các chức năng liên quan đến giấy chứng nhận hiến máu
 * Bao gồm tạo mới, lấy thông tin theo ID, lấy danh sách theo người dùng
 * và lấy danh sách tất cả các lần hiến máu
 */

/**
 * Tạo giấy chứng nhận hiến máu mới
 * @param {Object} data - Dữ liệu giấy chứng nhận cần tạo
 * @returns {Object} Thông tin giấy chứng nhận đã tạo
 */
export const createCertificate = async (data) => {
  try {

    const response = await api.post('/certificates/create-certificate', data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo giấy chứng nhận:', error);
    throw error;
  }
};
/**
 * Lấy thông tin giấy chứng nhận theo ID
 * @param {number} certificateId - ID của giấy chứng nhận
 * @returns {Object} Thông tin giấy chứng nhận
 */
export const getCertificateById = async (certificateId) => {
  try {

    const response = await api.get(`/certificates/get-certificate-by-id/${certificateId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy certificate:', error);
    throw error;
  }
};
/**
 * Lấy danh sách giấy chứng nhận của một người dùng
 * @param {number} userId - ID của người dùng
 * @returns {Array} Danh sách giấy chứng nhận của người dùng
 */
export const getUserCertificates = async (userId) => {
  try {
    
    const response = await api.get(`/certificates/donor/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách certificate:', error);
    throw error;
  }
};
/**
 * Lấy danh sách tất cả các lần hiến máu cho bác sĩ
 * @returns {Array} Danh sách các lần hiến máu
 */
export const getAllDonationsForDoctor = async () => {
  try {
   
    const response = await api.get('/blood-register/get-list-donation'); 
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hiến máu:', error);
    throw error;
  }
};