import api from "../config/api";

// Lấy danh sách người hiến máu
export const getAllDonors = async () => {
  const response = await api.get('/blood-register/get-list-donation');
  return response.data;
};

// Lấy lịch sử hiến máu theo userId
export const getDonationHistoryByUserId = async (userId) => {
  try {
    const response = await api.get(`/blood-register/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử hiến máu:", error);
    throw error;
  }
};

// Lấy số lần hiến thực tế dựa trên lịch sử hiến máu
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
