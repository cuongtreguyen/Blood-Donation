import api from "../config/api";

/**
 * Service xử lý các chức năng liên quan đến quản lý kho máu
 * Bao gồm lấy thông tin, tạo mới, cập nhật, xóa và thêm máu vào kho
 */
/**
 * Lấy thông tin kho máu theo ID
 * @param {number} id - ID của kho máu cần lấy thông tin
 * @returns {Object} Thông tin kho máu
 */
export const getBloodInventoryById = async (id) => {
  try {
    const response = await api.get(`/blood-inventory/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy thông tin kho máu:", error);
    throw error;
  }
};
/**
 * Lấy danh sách tất cả kho máu
 * @returns {Array} Danh sách kho máu
 */
export const getAllBloodInventory = async () => {
  try {
    const response = await api.get("/blood-inventory/get-all");
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi hiển thị kho máu:", error);
    throw error;
  }
};
/**
 * Tạo mới kho máu
 * @param {Object} data - Dữ liệu kho máu cần tạo
 * @returns {Object} Thông tin kho máu đã tạo
 */
export const createBloodInventory = async (data) => {
  try {
    const response = await api.post("/blood-inventory/create", data);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi khởi tạo kho máu:", error);
    throw error;
  }
};
/**
 * Cập nhật thông tin kho máu theo ID
 * @param {number} id - ID của kho máu cần cập nhật
 * @param {Object} data - Dữ liệu kho máu cần cập nhật
 * @returns {Object} Thông tin kho máu đã cập nhật
 */
export const updateBloodInventory = async (id, data) => {
  try {
    const response = await api.put(`/blood-inventory/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi cập nhật kho máu:", error);
    throw error;
  }
};
/**
 * Xóa kho máu theo ID
 * @param {number} id - ID của kho máu cần xóa
 * @returns {Object} Kết quả xóa kho máu
 */
export const deleteBloodInventory = async (id) => {
  try {
    const response = await api.patch(`/blood-inventory/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi xóa kho máu:", error);
    throw error;
  }
};
/**
 * Thêm máu vào kho theo nhóm máu
 * @param {string} bloodType - Nhóm máu cần thêm (A+, B+, AB+, O+, A-, B-, AB-, O-)
 * @param {number} amount - Số lượng đơn vị máu cần thêm
 * @returns {Object} Thông tin kho máu sau khi thêm
 */
export const addBloodToInventory = async (bloodType, amount) => {
  try {
    // Lấy toàn bộ kho máu
    const inventories = await getAllBloodInventory();
    // Tìm kho máu theo bloodType
    const inventory = inventories.find(item => item.bloodType === bloodType);
    if (!inventory) throw new Error('Không tìm thấy kho máu cho nhóm máu này');
    // Cộng thêm số lượng máu mới
    const newUnits = (inventory.unitsAvailable || 0) + amount;
    // Gọi API cập nhật kho máu
    const updated = await updateBloodInventory(inventory.id, {
      ...inventory,
      unitsAvailable: newUnits
    });
    return updated;
  } catch (error) {
    console.error('Lỗi khi thêm máu vào kho:', error);
    throw error;
  }
};