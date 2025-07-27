import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng ký email
    console.log('Email đăng ký:', email);
    setEmail('');
  };

  return (
    <footer className="bg-red-700 text-white" style={{ backgroundColor: '#b91c1c', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="hover:text-red-200 transition-colors" 
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a 
                  href="#donation-process" 
                  className="hover:text-red-200 transition-colors" 
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Hiến máu
                </a>
              </li>
              <li>
                <a 
                  href="#donation-centers" 
                  className="hover:text-red-200 transition-colors" 
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Điểm hiến máu
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="hover:text-red-200 transition-colors" 
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Về chúng tôi
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Liên Hệ</h3>
            <ul className="space-y-2">
              <li>123 Đường Trung Tâm Máu</li>
              <li>Thành phố Hồ Chí Minh, Việt Nam</li>
              <li>Điện thoại: (123) 456-7890</li>
              <li>Email: info@dongmauviet.com</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Giờ Mở Cửa</h3>
            <ul className="space-y-2">
              <li>Thứ 2 - Thứ 6: 8h - 20h</li>
              <li>Thứ 7: 9h - 18h</li>
              <li>Chủ nhật: 10h - 16h</li>
              <li>Trường hợp khẩn cấp: 24/7</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Đăng Ký Nhận Tin</h3>
            <p className="mb-4">Nhận thông báo mới nhất từ chúng tôi</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md mb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ backgroundColor: 'white', color: '#111827' }}
              />
              <button
                onClick={handleSubmit}
                className="w-full hover:bg-red-50 px-4 py-2 rounded-md font-semibold transition-colors"
                style={{ backgroundColor: 'white', color: '#dc2626' }}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid #dc2626' }}>
          <p>© 2024 Dòng Máu Việt. Bản quyền đã được bảo hộ.</p>
          <div className="mt-2">
            <a 
              href="#" 
              className="hover:text-red-200 transition-colors mx-2" 
              style={{ color: "white", textDecoration: "none" }}
            >
              Chính sách bảo mật
            </a>
            <a 
              href="#" 
              className="hover:text-red-200 transition-colors mx-2" 
              style={{ color: "white", textDecoration: "none" }}
            >
              Điều khoản dịch vụ
            </a>
            <a 
              href="#" 
              className="hover:text-red-200 transition-colors mx-2" 
              style={{ color: "white", textDecoration: "none" }}
            >
              Chính sách Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
