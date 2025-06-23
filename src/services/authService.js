import api from "../config/api";

class AuthService {
  // Đăng nhập
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Lưu token vào localStorage nếu có
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Đăng ký
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Quên mật khẩu
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Làm mới token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token found');

      const response = await api.post('/auth/refresh', null, {
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      this.setToken(response.data.token);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Đăng xuất
  async logout() {
    try {
      const token = this.getToken();
      // Gửi request logout nếu có token
      if (token) {
        await api.post('/auth/logout', null, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      this.clearAuthData();
      return {
        success: true
      };
    } catch (error) {
      this.clearAuthData();
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');

      const response = await api.get('/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Kiểm tra token có hợp lệ không
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await api.get('/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.status === 200; // Hoặc logic kiểm tra thành công khác
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  }

  // Cập nhật thông tin user
  async updateUser(userData) {
    try {
      const response = await api.put('/update-user', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Cập nhật mật khẩu
  async updatePassword(passwordData) {
    try {
      const response = await api.put('/update-user/email-password', passwordData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // === UTILITY METHODS ===

  setToken(token) {
    localStorage.setItem('userToken', token);
  }

  getToken() {
    return localStorage.getItem('userToken');
  }

  setRefreshToken(refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  clearAuthData() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberUser');
  }
}

export default new AuthService(); 