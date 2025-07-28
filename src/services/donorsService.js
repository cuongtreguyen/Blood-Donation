import api from "../config/api";

/**
 * Service xử lý các chức năng liên quan đến người hiến máu
 * Bao gồm lấy danh sách người hiến, lịch sử hiến máu và tính số lần hiến thực tế
 */

/**
 * Lấy danh sách tất cả các lần hiến máu đã hoàn thành
 * @returns {Array} Danh sách các lần hiến máu đã hoàn thành
 */
export const getAllCompletedDonations = async () => {
  const response = await api.get('/blood-register/get-list-donation');
  return response.data;
};

/**
 * Lấy danh sách tất cả người hiến máu (alias của getAllCompletedDonations)
 * @returns {Array} Danh sách người hiến máu
 */
export const getAllDonors = getAllCompletedDonations;


/**
 * Lấy lịch sử hiến máu của một người dùng theo ID
 * @param {number} userId - ID của người dùng
 * @returns {Array} Lịch sử hiến máu của người dùng
 */
export const getDonationHistoryByUserId = async (userId) => {
  try {
    const response = await api.get(`/blood-register/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử hiến máu:", error);
    throw error;
  }
};

/**
 * Tính số lần hiến máu thực tế của một người dùng
 * Chỉ đếm các lần hiến có đầy đủ thông tin (completedDate và unit > 0)
 * @param {number} userId - ID của người dùng
 * @returns {number} Số lần hiến máu thực tế
 */
export const getActualDonationCount = async (userId) => {
  try {
    const history = await getDonationHistoryByUserId(userId);
    // Đếm số lần hiến có dữ liệu đầy đủ
    const validDonations = (history || []).filter(item => 
      item.completedDate && item.unit && item.unit > 0
    );
    return validDonations.length;
  } catch (error) {
    console.error("Lỗi khi tính số lần hiến thực tế:", error);
    return 0;
  }
};