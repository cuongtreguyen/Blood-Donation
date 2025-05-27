import React, { useState, useEffect, useRef } from 'react';

function Navbar() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    bloodType: '',
    address: ''
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const loginModalRef = useRef(null);
  const registerModalRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.bootstrap) {
      const loginEl = document.getElementById('loginModal');
      const registerEl = document.getElementById('registerModal');
      loginModalRef.current = window.bootstrap.Modal.getOrCreateInstance(loginEl);
      registerModalRef.current = window.bootstrap.Modal.getOrCreateInstance(registerEl);

      return () => {
        loginModalRef.current?.dispose();
        registerModalRef.current?.dispose();
      };
    }
  }, []);

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Đăng nhập với:', loginData);
    alert(`Đang đăng nhập với email: ${loginData.email}`);
    loginModalRef.current?.hide();
    setLoginData({ email: '', password: '' });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    console.log('Đăng ký với:', registerData);
    alert(`Đăng ký thành công cho: ${registerData.fullName}`);
    registerModalRef.current?.hide();
    setRegisterData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      bloodType: '',
      address: ''
      });
  };

  const handleShowLogin = () => {
    registerModalRef.current?.hide();
    loginModalRef.current?.show();
  };

  const handleShowRegister = () => {
    loginModalRef.current?.hide();
    registerModalRef.current?.show();
  };

  const openLoginModal = () => {
    loginModalRef.current?.show();
  };

  const toggleNavbar = () => {
    setIsNavOpen(prev => !prev);
  };

  return (
    <>
      <nav className="navbar navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid px-4">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
              alt="Logo"
              style={{ height: '40px', marginRight: '10px' }}
            />
            <span className="fw-bold text-danger">Dòng Máu Việt</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`navbar-collapse ${isNavOpen ? 'show' : 'collapse'}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#home">Trang Chủ</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#donate">Hiến Máu</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#locations">Địa Điểm</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold" href="#about">Về Chúng Tôi</a>
              </li>
              <li className="nav-item ms-2">
                <button className="btn btn-danger fw-bold px-4" onClick={openLoginModal}>
                  Đăng nhập
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <LoginModal
        loginData={loginData}
        onChange={handleLoginInputChange}
        onSubmit={handleLoginSubmit}
        onSwitch={handleShowRegister}
      />
      <RegisterModal
        registerData={registerData}
        onChange={handleRegisterInputChange}
        onSubmit={handleRegisterSubmit}
        onSwitch={handleShowLogin}
      />
    </>
  );
}

// LoginModal and RegisterModal remain unchanged
function LoginModal({ loginData, onChange, onSubmit, onSwitch }) {
  return (
    <div className="modal fade" id="loginModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-danger">Đăng Nhập</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body pt-0">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  id="email"
                  placeholder="Nhập email"
                  value={loginData.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  id="password"
                  placeholder="Nhập mật khẩu"
                  value={loginData.password}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                </div>
                <a href="#" className="text-decoration-none text-danger">Quên mật khẩu?</a>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-danger btn-lg">Đăng Nhập</button>
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Hủy</button>
              </div>
            </form>
            <hr className="my-4" />
            <div className="text-center">
              <p className="mb-2">Chưa có tài khoản?</p>
              <button className="btn btn-outline-danger" onClick={onSwitch}>Đăng ký ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({ registerData, onChange, onSubmit, onSwitch }) {
  return (
    <div className="modal fade" id="registerModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-danger">Đăng Ký Tài Khoản</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body pt-0">
            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="fullName" className="form-label fw-semibold">Họ và tên *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Nhập họ và tên"
                    value={registerData.fullName}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="registerEmail" className="form-label fw-semibold">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="registerEmail"
                    name="email"
                    required
                    placeholder="Nhập email"
                    value={registerData.email}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="registerPassword" className="form-label fw-semibold">Mật khẩu *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    name="password"
                    required
                    placeholder="Nhập mật khẩu"
                    value={registerData.password}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Nhập lại mật khẩu"
                    value={registerData.confirmPassword}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label fw-semibold">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={registerData.phone}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="bloodType" className="form-label fw-semibold">Nhóm máu</label>
                  <select
                    className="form-select"
                    id="bloodType"
                    name="bloodType"
                    value={registerData.bloodType}
                    onChange={onChange}
                  >
                    <option value="">Chọn nhóm máu</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label fw-semibold">Địa chỉ</label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  rows="2"
                  placeholder="Nhập địa chỉ"
                  value={registerData.address}
                  onChange={onChange}
                ></textarea>
              </div>
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="agreeTerms"
                  required
                />
                <label className="form-check-label" htmlFor="agreeTerms">
                  Tôi đồng ý với <a href="#" className="text-danger">điều khoản sử dụng</a> và{' '}
                  <a href="#" className="text-danger">chính sách bảo mật</a>
                </label>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-danger btn-lg">Đăng Ký</button>
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                  Hủy
                </button>
              </div>
            </form>
            <hr className="my-4" />
            <div className="text-center">
              <p className="mb-2">Đã có tài khoản?</p>
              <button className="btn btn-outline-danger" onClick={onSwitch}>
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;