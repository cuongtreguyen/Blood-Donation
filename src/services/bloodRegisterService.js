import api from "../config/api";

/**
 * Service xử lý các chức năng liên quan đến đăng ký hiến máu
 * Bao gồm lấy danh sách đăng ký theo trạng thái, cập nhật trạng thái, hoàn thành đơn hiến máu,
 * lấy hồ sơ y tế và lịch sử hiến máu
 */
/**
 * Lấy danh sách đăng ký hiến máu theo trạng thái
 * @param {string|Array} statuses - Trạng thái hoặc mảng các trạng thái cần lọc
 * @returns {Array} Danh sách đăng ký hiến máu theo trạng thái
 */
export const getBloodRegisterByStatus = async (statuses) => {
  const params = new URLSearchParams();
  const statusArray = Array.isArray(statuses) ? statuses : [statuses];

  statusArray.forEach((status) => {
    if (status && status !== "ALL") {
      params.append("status", status);
    }
  });

  const response = await api.get(`/blood-register/list-by-status?${params.toString()}`);
  return response.data || [];
};




/**
 * Cập nhật trạng thái đơn đăng ký hiến máu
 * @param {number} id - ID của đơn đăng ký hiến máu
 * @param {string} status - Trạng thái mới (PENDING, APPROVED, REJECTED, COMPLETED, INCOMPLETED)
 * @returns {Object} Kết quả cập nhật trạng thái
 */
export const updateBloodRegisterStatus = async (id, status) => {
  const response = await api.patch(`/blood-register/update-status/${id}?status=${status}`);
  return response.data;
};

/**
 * Đánh dấu đơn hiến máu là đã hoàn thành (COMPLETED)
 * @param {Object} params - Tham số cần thiết
 * @param {number} params.bloodId - ID của đơn đăng ký hiến máu
 * @param {string} params.implementationDate - Ngày thực hiện hiến máu
 * @param {number} params.unit - Số đơn vị máu đã hiến
 * @returns {Object} Kết quả hoàn thành đơn hiến máu
 */
export const completeBloodRegister = async ({ bloodId, implementationDate, unit }) => {
  const response = await api.post("/blood-register/set-complete", {
    bloodId,
    implementationDate,
    unit,
  });
  return response.data;
};

/**
 * Lấy danh sách hồ sơ y tế (đơn đăng ký hiến máu) theo trạng thái
 * @param {string} status - Trạng thái cần lọc (tùy chọn)
 * @returns {Array} Danh sách hồ sơ y tế
 */
export const getAllMedicalRecords = async (status) => {
  try {
    const response = await api.get(`/blood-register/list-by-status${status ? `?status=${status}` : ''}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hồ sơ y tế:", error);
    throw error;
  }
};



/**
 * Lấy danh sách hồ sơ y tế của một người dùng
 * @param {number} userId - ID của người dùng
 * @returns {Array} Danh sách hồ sơ y tế của người dùng
 */
export const getMedicalRecordsByUser = async (userId) => {
  try {
    const response = await api.get(`/blood-register/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy hồ sơ y tế theo user:", error);
    throw error;
  }
};
/**
 * Lấy lịch sử hiến máu của một người dùng
 * @param {number} userId - ID của người dùng
 * @returns {Array} Lịch sử hiến máu của người dùng
 */
export const getDonationHistoryByUserId = async (userId) => {
  const res = await api.get(`/blood-register/history/${userId}`);
  return res.data;
};

/**
 * Lấy danh sách đơn hiến máu đã hoàn thành (có đầy đủ thông tin người hiến)
 * @returns {Array} Danh sách đơn hiến máu đã hoàn thành
 */
export const getListDonation = async () => {
  const response = await api.get("/blood-register/get-list-donation");
  return response.data || [];
};