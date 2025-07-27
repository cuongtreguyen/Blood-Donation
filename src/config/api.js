import axios from "axios";

const api = axios.create({
  // baseURL: "http://103.200.20.149/:8080/api/",
  baseURL: "http://14.225.205.143:8080/api/",
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
// // File: src/config/api.js

// import axios from "axios";
// import { message } from 'antd';

// const api = axios.create({
//   // baseURL của bạn
//   baseURL: "http://14.225.205.143:8080/api/",
//   // Có thể thêm timeout để tránh request bị treo
//   timeout: 15000, 
// });

// // =============================================================
// // BỘ CHẶN YÊU CẦU (Request Interceptor) - PHẦN NÀY ĐÃ ĐÚNG
// // Tự động thêm token vào mỗi yêu cầu
// // =============================================================
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


// // =============================================================
// // BỘ XỬ LÝ PHẢN HỒI (Response Interceptor) - ***FIX LỖI TẠI ĐÂY***
// // Xử lý TẤT CẢ các phản hồi từ server
// // =============================================================
// api.interceptors.response.use(
//   // 1. Hàm này chạy cho các mã trạng thái THÀNH CÔNG (2xx)
//   (response) => {
//     // ★★★ ĐÂY LÀ THAY ĐỔI QUAN TRỌNG NHẤT ★★★
//     //
//     // Chúng ta trả về TOÀN BỘ đối tượng `response` nguyên bản.
//     // KHÔNG trả về `response.data`.
//     //
//     // LÝ DO:
//     // - Với API GET: Component của bạn sẽ nhận được `response` và có thể truy cập `response.data` như cũ. KHÔNG BỊ LỖI "mất dữ liệu".
//     // - Với API DELETE: Component của bạn sẽ nhận được `response` có `status: 204`. Promise được coi là thành công (`resolved`), khối `try` sẽ chạy tiếp. KHÔNG BỊ LỖI nhảy vào `catch`.
//     //
//     // Đây là cách sửa lỗi mà không phá vỡ cấu trúc code hiện tại của bạn.
//     return response;
//   },
//   // 2. Hàm này chỉ chạy khi có LỖI (mã 4xx, 5xx)
//   (error) => {
//     // Xử lý lỗi tập trung để hiển thị thông báo nhất quán
//     console.error("Lỗi API từ Interceptor:", error.response || error);

//     if (error.response) {
//       // Server có phản hồi lại với một mã lỗi
//       if (error.response.status === 401) {
//         message.error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
//         // Có thể thêm lệnh chuyển hướng về trang login tại đây
//       } else {
//         // Lấy thông báo lỗi từ server nếu có, nếu không thì dùng thông báo chung
//         const errorMessage = error.response.data?.message || "Có lỗi xảy ra từ máy chủ.";
//         message.error(errorMessage);
//       }
//     } else if (error.request) {
//       // Request đã được gửi nhưng không nhận được phản hồi (VD: Mất mạng, sai địa chỉ API)
//       message.error("Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại mạng.");
//     } else {
//       // Lỗi xảy ra khi thiết lập request
//       message.error("Có lỗi xảy ra, không thể gửi yêu cầu.");
//     }
    
//     // Rất quan trọng: Luôn trả về reject để khối .catch() trong component có thể bắt được
//     return Promise.reject(error);
//   }
// );

// export default api;