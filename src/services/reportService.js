import api from '../config/api';

/**
 * Service xử lý các chức năng liên quan đến báo cáo
 * Bao gồm tạo mới, cập nhật, lấy thông tin, lấy danh sách và xóa báo cáo
 */

/**
 * Tạo báo cáo mới
 * @param {Object} data - Dữ liệu báo cáo cần tạo
 * @returns {Promise<Object>} Kết quả tạo báo cáo
 */
export const createReport = (data) => {
  return api.post('/report/create', data);
};

/**
 * Cập nhật báo cáo theo ID
 * @param {number} id - ID của báo cáo cần cập nhật
 * @param {Object} data - Dữ liệu báo cáo cần cập nhật
 * @returns {Promise<Object>} Kết quả cập nhật báo cáo
 */
export const updateReport = (id, data) => {
  return api.patch(`/report/update/${id}`, data);
};

/**
 * Lấy chi tiết báo cáo theo ID
 * @param {number} id - ID của báo cáo
 * @returns {Promise<Object>} Thông tin chi tiết báo cáo
 */
export const getReportById = (id) => {
  return api.get(`/report/${id}`);
};

/**
 * Lấy danh sách tất cả báo cáo
 * @returns {Promise<Array>} Danh sách báo cáo
 */
export const getReportList = () => {
  return api.get('/report/list');
};

/**
 * Xóa báo cáo theo ID
 * @param {number} id - ID của báo cáo cần xóa
 * @returns {Promise<Object>} Kết quả xóa báo cáo
 */
export const deleteReport = (id) => {
  return api.delete(`/report/delete/${id}`);
};