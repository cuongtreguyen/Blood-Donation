import api from "../config/api";

/**
 * Service xử lý các chức năng liên quan đến xác thực người dùng
 * Bao gồm đăng nhập, đăng ký, quên mật khẩu, làm mới token, đăng xuất
 * và các thao tác quản lý thông tin người dùng
 */
class AuthService {
  /**
   * Đăng nhập người dùng với email và mật khẩu
   * @param {string} email - Email của người dùng
   * @param {string} password - Mật khẩu của người dùng
   * @returns {Object} Kết quả đăng nhập với trạng thái thành công và dữ liệu hoặc lỗi
   */
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

  /**
   * Đăng ký tài khoản người dùng mới
   * @param {Object} userData - Thông tin người dùng cần đăng ký
   * @returns {Object} Kết quả đăng ký với trạng thái thành công và dữ liệu hoặc lỗi
   */
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

  /**
   * Gửi yêu cầu khôi phục mật khẩu cho email đã đăng ký
   * @param {string} email - Email của người dùng cần khôi phục mật khẩu
   * @returns {Object} Kết quả yêu cầu với trạng thái thành công và dữ liệu hoặc lỗi
   */
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

  /**
   * Làm mới token xác thực khi token hiện tại hết hạn
   * @returns {Object} Token mới nếu thành công hoặc thông báo lỗi
   */
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

  /**
   * Đăng xuất người dùng và xóa dữ liệu xác thực khỏi localStorage
   * @returns {Object} Kết quả đăng xuất với trạng thái thành công hoặc lỗi
   */
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

  /**
   * Lấy thông tin người dùng hiện tại đã đăng nhập
   * @returns {Object} Thông tin người dùng nếu thành công hoặc thông báo lỗi
   */
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

  /**
   * Kiểm tra tính hợp lệ của token hiện tại
   * @returns {boolean} true nếu token hợp lệ, false nếu không hợp lệ
   */
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

  /**
   * Cập nhật thông tin cá nhân của người dùng
   * @param {Object} userData - Thông tin người dùng cần cập nhật
   * @returns {Object} Kết quả cập nhật với trạng thái thành công và dữ liệu hoặc lỗi
   */
  async updateUser(userData) {
    try {
      const response = await api.put('/user/update-user', userData);
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

  /**
   * Cập nhật mật khẩu của người dùng
   * @param {Object} passwordData - Dữ liệu mật khẩu cần cập nhật (mật khẩu cũ và mới)
   * @returns {Object} Kết quả cập nhật với trạng thái thành công và dữ liệu hoặc lỗi
   */
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

  /**
   * Lưu token xác thực vào localStorage
   * @param {string} token - Token xác thực cần lưu
   */
  setToken(token) {
    localStorage.setItem('userToken', token);
  }

  /**
   * Lấy token xác thực từ localStorage
   * @returns {string|null} Token xác thực hoặc null nếu không có
   */
  getToken() {
    return localStorage.getItem('userToken');
  }

  /**
   * Lưu refresh token vào localStorage
   * @param {string} refreshToken - Refresh token cần lưu
   */
  setRefreshToken(refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Lấy refresh token từ localStorage
   * @returns {string|null} Refresh token hoặc null nếu không có
   */
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Lưu thông tin người dùng vào localStorage
   * @param {Object} userInfo - Thông tin người dùng cần lưu
   */
  setUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  /**
   * Lấy thông tin người dùng từ localStorage
   * @returns {Object|null} Thông tin người dùng hoặc null nếu không có
   */
  getUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * Kiểm tra người dùng đã đăng nhập hay chưa
   * @returns {boolean} true nếu đã đăng nhập, false nếu chưa đăng nhập
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Xóa tất cả dữ liệu xác thực khỏi localStorage khi đăng xuất
   */
  clearAuthData() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberUser');
  }
}

export default new AuthService();