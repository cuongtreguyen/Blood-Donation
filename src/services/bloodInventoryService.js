import api from "../config/api";
// Get blood inventory by ID
export const getBloodInventoryById = async (id) => {
  try {
    const response = await api.get(`/blood-inventory/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy thông tin kho máu:", error);
    throw error;
  }
};
// Get all blood inventory
export const getAllBloodInventory = async () => {
  try {
    const response = await api.get("/blood-inventory/get-all");
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi hiển thị kho máu:", error);
    throw error;
  }
};
//Post : api/blood-inventory
export const createBloodInventory = async (data) => {
  try {
    const response = await api.post("/blood-inventory/create", data);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi khởi tạo kho máu:", error);
    throw error;
  }
};
// Update blood inventory by ID
export const updateBloodInventory = async (id, data) => {
  try {
    const response = await api.put(`/blood-inventory/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi cập nhật kho máu:", error);
    throw error;
  }
};
// Delete blood inventory by ID
export const deleteBloodInventory = async (id) => {
  try {
    const response = await api.delete(`/blood-inventory/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi xóa kho máu:", error);
    throw error;
  }
}; 