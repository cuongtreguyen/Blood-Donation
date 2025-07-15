import api from '../config/api';

// Tạo báo cáo mới
export const createReport = (data) => {
  return api.post('/report/create', data);
};

// Cập nhật báo cáo theo id
export const updateReport = (id, data) => {
  return api.patch(`/report/update/${id}`, data);
};

// Lấy chi tiết báo cáo theo id
export const getReportById = (id) => {
  return api.get(`/report/${id}`);
};

// Lấy danh sách báo cáo
export const getReportList = () => {
  return api.get('/report/list');
};

// Xóa báo cáo theo id
export const deleteReport = (id) => {
  return api.delete(`/report/delete/${id}`);
}; 