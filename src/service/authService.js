// services/authService.js

// const API_BASE_URL = 'https://6837f5e12c55e01d184b5c20.mockapi.io/api/v1/users';

// class AuthService {
//   // Đăng nhập
//   async login(email, password) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       return {
//         success: true,
//         data: data
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   // Đăng ký
//   async register(userData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData)
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       return {
//         success: true,
//         data: data
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   // Quên mật khẩu
//   async forgotPassword(email) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Request failed');
//       }

//       return {
//         success: true,
//         data: data
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   // Làm mới token
//   async refreshToken() {
//     try {
//       const refreshToken = this.getRefreshToken();
      
//       const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${refreshToken}`
//         }
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Token refresh failed');
//       }

//       // Lưu token mới
//       this.setToken(data.token);
      
//       return {
//         success: true,
//         data: data
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   // Đăng xuất
//   async logout() {
//     try {
//       const token = this.getToken();
      
//       const response = await fetch(`${API_BASE_URL}/auth/logout`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       // Xóa token dù API có thành công hay không
//       this.clearAuthData();
      
//       return {
//         success: true
//       };
//     } catch (error) {
//       // Vẫn xóa token local nếu có lỗi
//       this.clearAuthData();
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   // Lấy thông tin user hiện tại
//   async getCurrentUser() {
//     try {
//       const token = this.getToken();
      
//       const response = await fetch(`${API_BASE_URL}/auth/me`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Get user failed');
//       }

//       return {
//         success: true,
//         data: data
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   // Kiểm tra token có hợp lệ không
//   async verifyToken() {
//     try {
//       const token = this.getToken();
//       if (!token) return false;

//       const response = await fetch(`${API_BASE_URL}/auth/verify`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   }

//   // === UTILITY METHODS ===

//   // Lưu token
//   setToken(token) {
//     localStorage.setItem('userToken', token);
//   }

//   // Lấy token
//   getToken() {
//     return localStorage.getItem('userToken');
//   }

//   // Lưu refresh token
//   setRefreshToken(refreshToken) {
//     localStorage.setItem('refreshToken', refreshToken);
//   }

//   // Lấy refresh token
//   getRefreshToken() {
//     return localStorage.getItem('refreshToken');
//   }

//   // Lưu thông tin user
//   setUserInfo(userInfo) {
//     localStorage.setItem('userInfo', JSON.stringify(userInfo));
//   }

//   // Lấy thông tin user
//   getUserInfo() {
//     const userInfo = localStorage.getItem('userInfo');
//     return userInfo ? JSON.parse(userInfo) : null;
//   }

//   // Kiểm tra đã đăng nhập chưa
//   isAuthenticated() {
//     return !!this.getToken();
//   }

//   // Xóa tất cả dữ liệu auth
//   clearAuthData() {
//     localStorage.removeItem('userToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('userInfo');
//     localStorage.removeItem('isAuthenticated');
//     localStorage.removeItem('rememberUser');
//   }
// }

// // Tạo instance duy nhất
// const authService = new AuthService();

// export default authService;