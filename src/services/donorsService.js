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
