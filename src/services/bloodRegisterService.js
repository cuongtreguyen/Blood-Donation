import api from "../config/api";

// Lấy danh sách đăng ký hiến máu theo trạng thái
export const getBloodRegisterByStatus = async (status) => {
  const response = await api.get(`/blood-register/list-by-status?status=${status}`);
  return response.data;
};

// Lấy toàn bộ danh sách đăng ký hiến máu (nếu cần)
export const getAllBloodRegister = async () => {
  const response = await api.get("/blood-register");
  return response.data;
};

// Cập nhật trạng thái đơn đăng ký hiến máu
export const updateBloodRegisterStatus = async (id, status) => {
  const response = await api.patch(`/blood-register/update-status/${id}`, { status });
  return response.data;
}; 