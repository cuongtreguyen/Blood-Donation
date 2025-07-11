import api from "../config/api";
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

//  Cập nhật trạng thái đơn đăng ký hiến máu (ví dụ: INCOMPLETED)
export const updateBloodRegisterStatus = async (id, status) => {
  const response = await api.patch(`/blood-register/update-status/${id}?status=${status}`);
  return response.data;
};

//  Đánh dấu đơn hiến máu là đã hoàn thành (COMPLETED)
export const completeBloodRegister = async ({ bloodId, implementationDate, unit }) => {
  const response = await api.post("/blood-register/set-complete", {
    bloodId,
    implementationDate,
    unit,
  });
  return response.data;
};

// Lấy danh sách hồ sơ y tế (đơn đăng ký hiến máu) theo trạng thái
export const getAllMedicalRecords = async (status) => {
  try {
    const response = await api.get(`/blood-register/list-by-status${status ? `?status=${status}` : ''}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hồ sơ y tế:", error);
    throw error;
  }
};

// Lấy danh sách hồ sơ y tế của một user
export const getMedicalRecordsByUser = async (userId) => {
  try {
    const response = await api.get(`/blood-register/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy hồ sơ y tế theo user:", error);
    throw error;
  }
};
export const getDonationHistoryByUserId = async (userId) => {
  const res = await api.get(`/blood-register/history/${userId}`);
  return res.data;
};