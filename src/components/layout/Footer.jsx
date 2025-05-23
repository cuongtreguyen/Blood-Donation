import React from 'react';

// Footer Component
function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
                alt="Logo"
                style={{ height: '40px', marginRight: '10px' }}
              />
              <span className="fw-bold fs-4">Blood Donation Center</span>
            </div>
            <p className="text-muted">
              Cùng nhau xây dựng cộng đồng hiến máu tình nguyện, mang lại hy vọng cho những người cần máu...
            </p>
          </div>
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Liên Kết</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#home" className="text-muted text-decoration-none">Trang Chủ</a></li>
              <li className="mb-2"><a href="#donate" className="text-muted text-decoration-none">Hiến Máu</a></li>
              <li className="mb-2"><a href="#locations" className="text-muted text-decoration-none">Địa Điểm</a></li>
              <li className="mb-2"><a href="#about" className="text-muted text-decoration-none">Về Chúng Tôi</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Thông Tin</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Điều kiện hiến máu</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Câu hỏi thường gặp</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Chính sách bảo mật</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <div className="col-lg-3 mb-4">
            <h5 className="fw-bold mb-3">Liên Hệ</h5>
            <div className="mb-2">
              <i className="fas fa-phone me-2"></i>
              <span>Hotline: 1900 123 456</span>
            </div>
            <div className="mb-2">
              <i className="fas fa-envelope me-2"></i>
              <span>info@blooddonation.vn</span>
            </div>
            <div className="mb-3">
              <i className="fas fa-map-marker-alt me-2"></i>
              <span>123 Đường ABC, Quận 1, TP.HCM</span>
            </div>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted">
              © 2024 Blood Donation Center. Tất cả quyền được bảo lưu.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <span className="text-muted">Made with ❤️ for humanity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 