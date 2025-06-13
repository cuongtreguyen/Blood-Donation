import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  
  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để truy cập trang quản trị");
    } else if (user.role !== "ADMIN") {
      toast.error("Bạn không có quyền truy cập trang này");
    }
  }, [user]);

  // Kiểm tra user đã đăng nhập chưa
  if (!user) {
    // Lưu lại trang đang cố gắng truy cập để sau khi đăng nhập sẽ chuyển hướng lại
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    // Chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra user có phải admin không
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Nếu đã đăng nhập và có quyền admin, hiển thị nội dung con
  return children;
};

export default AdminProtectedRoute;