import api from "../config/api";

//  Lấy danh sách đăng ký hiến máu theo trạng thái
export const getBloodRegisterByStatus = async (status) => {
  const response = await api.get(`/blood-register/list-by-status?status=${status}`);
  return response.data;
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