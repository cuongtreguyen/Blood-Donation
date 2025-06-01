// hooks/useAuth.js

import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { message } from 'antd';

// Tạo Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        // Kiểm tra token còn hợp lệ không
        const isValid = await authService.verifyToken();
        if (isValid) {
          const userInfo = authService.getUserInfo();
          setUser(userInfo);
          setIsAuthenticated(true);
        } else {
          // Token hết hạn, thử refresh
          const refreshResult = await authService.refreshToken();
          if (refreshResult.success) {
            const userInfo = authService.getUserInfo();
            setUser(userInfo);
            setIsAuthenticated(true);
          } else {
            // Không thể refresh, đăng xuất
            await logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, remember = false) => {
    try {
      setIsLoading(true);
      const result = await authService.login(email, password);
      
      if (result.success) {
        const { token, refreshToken, user } = result.data;
        
        // Lưu tokens và user info
        authService.setToken(token);
        if (refreshToken) {
          authService.setRefreshToken(refreshToken);
        }
        authService.setUserInfo(user);
        
        if (remember) {
          localStorage.setItem('rememberUser', 'true');
        }
        
        setUser(user);
        setIsAuthenticated(true);
        
        message.success('Đăng nhập thành công!');
        return { success: true };
      } else {
        message.error(result.error || 'Đăng nhập thất bại!');
        return { success: false, error: result.error };
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng nhập!');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const result = await authService.register(userData);
      
      if (result.success) {
        message.success('Đăng ký thành công!');
        return { success: true };
      } else {
        message.error(result.error || 'Đăng ký thất bại!');
        return { success: false, error: result.error };
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng ký!');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      
      message.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        message.success('Email khôi phục mật khẩu đã được gửi!');
        return { success: true };
      } else {
        message.error(result.error || 'Gửi email thất bại!');
        return { success: false, error: result.error };
      }
    } catch (error) {
      message.error('Có lỗi xảy ra!');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher Order Component để bảo vệ routes
export const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};

// Component để bảo vệ routes
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};