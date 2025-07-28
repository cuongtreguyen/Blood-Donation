import api from "../config/api";

/**
 * Service xử lý các chức năng liên quan đến yêu cầu nhận máu
 * Bao gồm tạo mới, lấy danh sách theo trạng thái, cập nhật, hoàn thành yêu cầu nhận máu
 * và lấy lịch sử nhận máu
 */

/**
 * Tạo mới yêu cầu nhận máu
 * @param {Object} data - Dữ liệu yêu cầu nhận máu
 * @returns {Object} Thông tin yêu cầu nhận máu đã tạo
 */
export const createBloodReceive = async (data) => {
  const response = await api.post("/blood-receive/create", data);
  return response.data;
};

/**
 * Lấy danh sách yêu cầu nhận máu theo trạng thái
 * @param {Array} statusArr - Mảng các trạng thái cần lọc
 * @returns {Array} Danh sách yêu cầu nhận máu theo trạng thái
 */
export const getBloodReceiveByStatus = async (statusArr) => {
  const params = new URLSearchParams();
  statusArr.forEach((s) => params.append("status", s));
  const response = await api.get(`/blood-receive/list-by-status?${params.toString()}`);
  return response.data;
};

/**
 * Lấy thông tin yêu cầu nhận máu theo ID
 * @param {number} id - ID của yêu cầu nhận máu
 * @returns {Object} Thông tin yêu cầu nhận máu
 */
export const getBloodReceiveById = async (id) => {
  const response = await api.get(`/blood-receive/get/${id}`);
  return response.data;
};

/**
 * Lấy danh sách yêu cầu nhận máu của một người dùng
 * @param {number} userId - ID của người dùng
 * @returns {Array} Danh sách yêu cầu nhận máu của người dùng
 */
export const getBloodReceiveByUserId = async (userId) => {
  const response = await api.get(`/blood-receive/get-blood-receive-by-user-id?userId=${userId}`);
  return response.data;
};

/**
 * Cập nhật thông tin yêu cầu nhận máu
 * @param {number} id - ID của yêu cầu nhận máu
 * @param {Object} data - Dữ liệu cần cập nhật
 * @returns {Object} Thông tin yêu cầu nhận máu đã cập nhật
 */
export const updateBloodReceive = async (id, data) => {
  const response = await api.put(`/blood-receive/update/${id}`, data);
  return response.data;
};

/**
 * Cập nhật trạng thái yêu cầu nhận máu
 * @param {number} id - ID của yêu cầu nhận máu
 * @param {string} status - Trạng thái mới (PENDING, APPROVED, REJECTED, COMPLETED)
 * @returns {Object} Kết quả cập nhật trạng thái
 */
export const updateBloodReceiveStatus = async (id, status) => {
  const response = await api.patch(`/blood-receive/update-status/${id}?status=${status}`);
  return response.data;
};


/**
 * Đánh dấu yêu cầu nhận máu là đã hoàn thành
 * @param {Object} params - Tham số cần thiết
 * @param {number} params.bloodID - ID của yêu cầu nhận máu
 * @param {string} params.implementationDate - Ngày thực hiện nhận máu
 * @param {number} params.unit - Số đơn vị máu đã nhận
 * @returns {Object} Kết quả hoàn thành yêu cầu nhận máu
 */
export const setCompleteBloodReceive = async ({  bloodId , implementationDate, unit }) => {
  const response = await api.post("/blood-receive/set-complete", {
    bloodId ,
    implementationDate,
    unit,
  });
  return response.data;
};

/**
 * Lấy lịch sử nhận máu
 * @returns {Array} Danh sách lịch sử nhận máu
 */
export const getBloodReceiveHistory = async () => {
  const response = await api.get("/blood-receive/get-list-receive");
  return response.data;
};