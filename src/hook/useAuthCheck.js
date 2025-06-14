import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function useAuthCheck(redirectPath = '/login', showToast = true) {
  const userFromRedux = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Kiểm tra từ localStorage
    let userFromStorage = null;
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser) {
      try {
        userFromStorage = JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    
    // Nếu có user trong Redux hoặc localStorage, coi như đã đăng nhập
    const finalUserData = userFromRedux && Object.keys(userFromRedux).length > 0 
      ? userFromRedux 
      : userFromStorage;
    
    // Kiểm tra xác thực - CHỈ cần có một trong hai
    const authenticated = !!(finalUserData || token);
    
    // Chỉ chuyển hướng khi không xác thực và showToast=true
    if (!authenticated && showToast) {
      toast.error('Vui lòng đăng nhập để tiếp tục!', {
        position: "top-right",
        autoClose: 3000
      });
      
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate(redirectPath);
    }
    
    if (finalUserData) {
      setUserData(finalUserData);
    }
    
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, [userFromRedux, navigate, redirectPath, showToast]);

  return { 
    isAuthenticated, 
    isLoading, 
    userData 
  };
}