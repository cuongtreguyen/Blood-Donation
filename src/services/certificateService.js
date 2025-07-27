import api from '../config/api';

// Tạo giấy chứng nhận hiến máu
export const createCertificate = async (data) => {
  try {
    const response = await api.post('/blood-register/create-certificate', data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo giấy chứng nhận:', error);
    throw error;
  }
};

// Lấy certificate theo ID
export const getCertificateById = async (certificateId) => {
  try {
    const response = await api.get(`/blood-register/get-certificate/${certificateId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy certificate:', error);
    throw error;
  }
};

// Lấy danh sách certificate của user (cần thêm API này)
export const getUserCertificates = async (userId) => {
  try {
    // Tạm thời dùng API hiện có, cần backend thêm endpoint này
    const response = await api.get(`/blood-register/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách certificate:', error);
    throw error;
  }
};

// Tải certificate PDF
export const downloadCertificate = async (certificateId) => {
  try {
    const response = await api.get(`/blood-register/get-certificate/${certificateId}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải certificate:', error);
    throw error;
  }
};

// Lấy tất cả certificate (cho doctor) - cần thêm API này
export const getAllCertificates = async () => {
  try {
    // Tạm thời dùng API hiện có, cần backend thêm endpoint này
    const response = await api.get('/blood-register/get-list-donation');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả certificate:', error);
    throw error;
  }
}; 