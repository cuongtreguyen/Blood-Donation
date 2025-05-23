import React, { useState } from 'react';

// Emergency Banner Component
function EmergencyBanner() {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="alert alert-warning alert-dismissible fade show mb-0 text-center" style={{ borderRadius: 0 }}>
      <strong>🚨 KHẨN CẤP:</strong> Cần gấp nhóm máu O- và AB+. 
      <a href="#donate" className="alert-link fw-bold ms-2">Đăng ký ngay!</a>
      <button 
        type="button" 
        className="btn-close" 
        onClick={() => setShowBanner(false)}
      ></button>
    </div>
  );
}

export default EmergencyBanner; 