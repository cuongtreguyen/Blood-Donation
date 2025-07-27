// import React, { useState } from 'react';

// /**
//  * Component hiển thị banner thông báo khẩn cấp về nhu cầu hiến máu
//  * Cho phép hiển thị và ẩn banner thông qua state
//  * Hiển thị thông tin về nhóm máu đang cần gấp và link đăng ký hiến máu
//  */
// function EmergencyBanner() {
//   // State quản lý việc hiển thị/ẩn banner
//   const [showBanner, setShowBanner] = useState(true);

//   // Nếu banner đã bị ẩn thì không render gì cả
//   if (!showBanner) return null;

//   return (
//     <div className="alert alert-warning alert-dismissible fade show mb-0 text-center" style={{ borderRadius: 0 }}>
//       {/* Nội dung thông báo khẩn cấp */}
//       <strong>🚨 KHẨN CẤP:</strong> Cần gấp nhóm máu O- và AB+. 
      
//       {/* Link đăng ký hiến máu */}
//       <a href="#home" className="alert-link fw-bold ms-2">Đăng ký ngay!</a>
      
//       {/* Nút đóng banner */}
//       <button 
//         type="button" 
//         className="btn-close" 
//         onClick={() => setShowBanner(false)}
//         aria-label="Đóng thông báo"
//       ></button>
//     </div>
//   );
// }

// export default EmergencyBanner; 



import React, { useState, useEffect } from 'react';
import api from '../../config/api';

/**
 * Component hiển thị banner thông báo khẩn cấp về nhu cầu hiến máu
 * Lấy dữ liệu nhóm máu khẩn cấp từ API và cho phép hiển thị/ẩn banner
 * Hiển thị thông tin về nhóm máu đang cần gấp và link đăng ký hiến máu
 * Chuyển đổi định dạng nhóm máu từ "AB_POSITIVE" thành "AB+" để hiển thị
 */
function EmergencyBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const [bloodType, setBloodType] = useState('');

  // Fetch emergency blood type from API
  useEffect(() => {
    api.get('/blood-receive/get-emergency-bloodType')
      .then(response => {
        // API trả về array: [{"bloodType":"AB_POSITIVE"}]
        let rawBloodType = response.data[0]?.bloodType || '';
        
        // Convert "AB_POSITIVE" to "AB+" and similar patterns
        let formattedBloodType = rawBloodType
          .replace('_POSITIVE', '+')
          .replace('_NEGATIVE', '-');
        
        setBloodType(formattedBloodType);
      })
      .catch(error => {
        console.error('Error fetching blood type:', error);
      });
  }, []);

  if (!showBanner) return null;

  return (
    <div className="alert alert-warning alert-dismissible fade show mb-0 text-center" style={{ borderRadius: 0 }}>
      {/* Nội dung thông báo khẩn cấp */}
      <strong>🚨 KHẨN CẤP:</strong> Cần gấp nhóm máu {bloodType}. 
      
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