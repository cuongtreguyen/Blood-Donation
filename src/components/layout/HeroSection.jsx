import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Hero Section Component
function HeroSection({ onLearnMoreClick }) {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationFormData, setDonationFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    weight: '',
    height: '',
    address: '',
    city: '',
    medicalHistory: '',
    lastDonation: '',
    preferredDate: '',
    preferredTime: '',
    preferredLocation: '',
    emergencyContact: '',
    emergencyPhone: '',
    hasChronicDisease: false,
    isTakingMedication: false,
    hasRecentSurgery: false,
    agreesToTerms: false
  });

  const handleDonationInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!donationFormData.agreesToTerms) {
      alert('Vui lòng đồng ý với các điều khoản và điều kiện!');
      return;
    }

    if (!donationFormData.fullName || !donationFormData.email || !donationFormData.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Calculate age
    const today = new Date();
    const birthDate = new Date(donationFormData.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18 || age > 60) {
      alert('Tuổi hiến máu phải từ 18 đến 60 tuổi!');
      return;
    }

    if (donationFormData.weight && parseInt(donationFormData.weight) < 45) {
      alert('Cân nặng tối thiểu để hiến máu là 45kg!');
      return;
    }

    console.log('Đăng ký hiến máu:', donationFormData);
    alert(`Cảm ơn ${donationFormData.fullName}! Đăng ký hiến máu thành công. Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận lịch hẹn.`);
    
    setShowDonationForm(false);
    setDonationFormData({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      weight: '',
      height: '',
      address: '',
      city: '',
      medicalHistory: '',
      lastDonation: '',
      preferredDate: '',
      preferredTime: '',
      preferredLocation: '',
      emergencyContact: '',
      emergencyPhone: '',
      hasChronicDisease: false,
      isTakingMedication: false,
      hasRecentSurgery: false,
      agreesToTerms: false
    });
  };

  const handleCloseDonationForm = () => {
    setShowDonationForm(false);
  };

  return (
    <>
      <section id="home" className="hero-section bg-gradient-danger text-white py-5" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' }}>
        <div className="container py-5">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Hiến Máu Cứu Người
                <br />
                <span className="text-warning">Chia Sẻ Yêu Thương</span>
              </h1>
              <p className="lead mb-4">
                Mỗi lần hiến máu của bạn có thể cứu sống đến 3 người. Hãy tham gia cùng chúng tôi trong sứ mệnh cao quý này.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button onClick={() => setShowDonationForm(true)} className="btn btn-danger btn-lg fw-bold px-4">
                  Đăng Ký Hiến Máu
                </button>
                <button
                  onClick={onLearnMoreClick}
                  className="btn btn-outline-light btn-lg fw-bold px-4"
                >
                  Tìm Hiểu Thêm
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Blood Donation" 
                className="img-fluid rounded-3 shadow-lg"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Donation Registration Modal */}
      {showDonationForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0 pb-0 bg-danger text-white">
                <h4 className="modal-title fw-bold">
                  <i className="fas fa-heart me-2"></i>
                  Đăng Ký Hiến Máu Tình Nguyện
                </h4>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseDonationForm}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-info mb-4">
                  <h6 className="fw-bold mb-2">
                    <i className="fas fa-info-circle me-2"></i>
                    Điều kiện hiến máu:
                  </h6>
                  <ul className="mb-0 small">
                    <li>Tuổi từ 18-60, cân nặng tối thiểu 45kg</li>
                    <li>Khỏe mạnh, không mắc bệnh truyền nhiễm</li>
                    <li>Không uống rượu bia 24h trước khi hiến máu</li>
                    <li>Nghỉ ngơi đủ giấc, ăn uống đầy đủ</li>
                  </ul>
                </div>

                <form onSubmit={handleDonationSubmit}>
                  {/* Thông tin cá nhân */}
                  <div className="border rounded p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-3">
                      <i className="fas fa-user me-2"></i>
                      Thông Tin Cá Nhân
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Họ và tên *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fullName"
                          value={donationFormData.fullName}
                          onChange={handleDonationInputChange}
                          placeholder="Nhập họ tên đầy đủ"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={donationFormData.email}
                          onChange={handleDonationInputChange}
                          placeholder="Nhập địa chỉ email"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Số điện thoại *</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={donationFormData.phone}
                          onChange={handleDonationInputChange}
                          placeholder="Số điện thoại"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Ngày sinh *</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfBirth"
                          value={donationFormData.dateOfBirth}
                          onChange={handleDonationInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Giới tính</label>
                        <select
                          className="form-select"
                          name="gender"
                          value={donationFormData.gender}
                          onChange={handleDonationInputChange}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8 mb-3">
                        <label className="form-label fw-semibold">Địa chỉ</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={donationFormData.address}
                          onChange={handleDonationInputChange}
                          placeholder="Số nhà, tên đường"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Thành phố</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={donationFormData.city}
                          onChange={handleDonationInputChange}
                          placeholder="Thành phố"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Thông tin sức khỏe */}
                  <div className="border rounded p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-3">
                      <i className="fas fa-heartbeat me-2"></i>
                      Thông Tin Sức Khỏe
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Nhóm máu</label>
                        <select
                          className="form-select"
                          name="bloodType"
                          value={donationFormData.bloodType}
                          onChange={handleDonationInputChange}
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
                          <option value="unknown">Chưa biết</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Cân nặng (kg) *</label>
                        <input
                          type="number"
                          className="form-control"
                          name="weight"
                          value={donationFormData.weight}
                          onChange={handleDonationInputChange}
                          placeholder="Cân nặng"
                          min="30"
                          max="200"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Chiều cao (cm)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="height"
                          value={donationFormData.height}
                          onChange={handleDonationInputChange}
                          placeholder="Chiều cao"
                          min="100"
                          max="250"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Lần hiến máu gần nhất</label>
                      <input
                        type="date"
                        className="form-control"
                        name="lastDonation"
                        value={donationFormData.lastDonation}
                        onChange={handleDonationInputChange}
                      />
                      <div className="form-text">Để trống nếu lần đầu hiến máu</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tiền sử bệnh (nếu có)</label>
                      <textarea
                        className="form-control"
                        name="medicalHistory"
                        value={donationFormData.medicalHistory}
                        onChange={handleDonationInputChange}
                        rows="2"
                        placeholder="Mô tả các bệnh đã từng mắc hoặc đang điều trị"
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="hasChronicDisease"
                            checked={donationFormData.hasChronicDisease}
                            onChange={handleDonationInputChange}
                          />
                          <label className="form-check-label">
                            Có bệnh mãn tính
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isTakingMedication"
                            checked={donationFormData.isTakingMedication}
                            onChange={handleDonationInputChange}
                          />
                          <label className="form-check-label">
                            Đang dùng thuốc
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="hasRecentSurgery"
                            checked={donationFormData.hasRecentSurgery}
                            onChange={handleDonationInputChange}
                          />
                          <label className="form-check-label">
                            Phẫu thuật gần đây
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin lịch hẹn */}
                  <div className="border rounded p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-3">
                      <i className="fas fa-calendar-alt me-2"></i>
                      Lịch Hẹn Hiến Máu
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Ngày mong muốn</label>
                        <input
                          type="date"
                          className="form-control"
                          name="preferredDate"
                          value={donationFormData.preferredDate}
                          onChange={handleDonationInputChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Giờ mong muốn</label>
                        <select
                          className="form-select"
                          name="preferredTime"
                          value={donationFormData.preferredTime}
                          onChange={handleDonationInputChange}
                        >
                          <option value="">Chọn giờ</option>
                          <option value="08:00">08:00 - 09:00</option>
                          <option value="09:00">09:00 - 10:00</option>
                          <option value="10:00">10:00 - 11:00</option>
                          <option value="11:00">11:00 - 12:00</option>
                          <option value="13:00">13:00 - 14:00</option>
                          <option value="14:00">14:00 - 15:00</option>
                          <option value="15:00">15:00 - 16:00</option>
                          <option value="16:00">16:00 - 17:00</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Địa điểm</label>
                        <select
                          className="form-select"
                          name="preferredLocation"
                          value={donationFormData.preferredLocation}
                          onChange={handleDonationInputChange}
                        >
                          <option value="">Chọn địa điểm</option>
                          <option value="central">Bệnh viện Đa khoa Trung ương</option>
                          <option value="hematology">Trung tâm Huyết học Quốc gia</option>
                          <option value="choray">Bệnh viện Chợ Rẫy</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Người liên hệ khẩn cấp */}
                  <div className="border rounded p-3 mb-4">
                    <h6 className="fw-bold text-danger mb-3">
                      <i className="fas fa-phone me-2"></i>
                      Người Liên Hệ Khẩn Cấp
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Họ tên</label>
                        <input
                          type="text"
                          className="form-control"
                          name="emergencyContact"
                          value={donationFormData.emergencyContact}
                          onChange={handleDonationInputChange}
                          placeholder="Tên người thân"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Số điện thoại</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="emergencyPhone"
                          value={donationFormData.emergencyPhone}
                          onChange={handleDonationInputChange}
                          placeholder="Số điện thoại người thân"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Đồng ý điều khoản */}
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="agreesToTerms"
                      checked={donationFormData.agreesToTerms}
                      onChange={handleDonationInputChange}
                      required
                    />
                    <label className="form-check-label">
                      Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý với{' '}
                      <a href="#" className="text-decoration-none text-danger">điều khoản hiến máu</a> và{' '}
                      <a href="#" className="text-decoration-none text-danger">chính sách bảo mật</a> *
                    </label>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary me-md-2"
                      onClick={handleCloseDonationForm}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-danger btn-lg px-4"
                    >
                      <i className="fas fa-heart me-2"></i>
                      Đăng Ký Hiến Máu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeroSection; 