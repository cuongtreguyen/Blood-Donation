import React, { useState } from 'react';

/**
 * Component hiển thị banner thông báo khẩn cấp về nhu cầu hiến máu
 * Cho phép hiển thị và ẩn banner thông qua state
 * Hiển thị thông tin về nhóm máu đang cần gấp và link đăng ký hiến máu
 */
function EmergencyBanner() {
  // State quản lý việc hiển thị/ẩn banner
  const [showBanner, setShowBanner] = useState(true);

  // Nếu banner đã bị ẩn thì không render gì cả
  if (!showBanner) return null;

  return (
    <div className="alert alert-warning alert-dismissible fade show mb-0 text-center" style={{ borderRadius: 0 }}>
      {/* Nội dung thông báo khẩn cấp */}
      <strong>🚨 KHẨN CẤP:</strong> Cần gấp nhóm máu O- và AB+. 
      
      {/* Link đăng ký hiến máu */}
      <a href="#home" className="alert-link fw-bold ms-2">Đăng ký ngay!</a>
      
      {/* Nút đóng banner */}
      <button 
        type="button" 
        className="btn-close" 
        onClick={() => setShowBanner(false)}
        aria-label="Đóng thông báo"
      ></button>
    </div>
  );
}

export default EmergencyBanner; 