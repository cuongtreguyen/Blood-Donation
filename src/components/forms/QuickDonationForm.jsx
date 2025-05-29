import React, { useState } from 'react';

// Quick Donation Form
function QuickDonationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    preferredDate: '',
    location: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quick donation form:', formData);
    alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm nhất.');
    setFormData({
      name: '',
      phone: '',
      bloodType: '',
      preferredDate: '',
      location: ''
    });
  };

  return (
    <section id="donate" className="py-5 bg-danger text-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="fw-bold mb-3">Đăng Ký Hiến Máu Nhanh</h2>
            <p className="lead mb-4">
              Chỉ cần 2 phút để đăng ký. Chúng tôi sẽ liên hệ và hướng dẫn bạn các bước tiếp theo.
            </p>
            <div className="d-flex align-items-center">
              <div className="bg-white bg-opacity-20 rounded-circle p-3 me-3">
                <i className="fas fa-shield-alt fa-2x"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1">An Toàn 100%</h5>
                <p className="mb-0">Quy trình hiến máu đạt tiêu chuẩn quốc tế</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Họ và tên *"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Số điện thoại *"
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <select
                        className="form-select form-select-lg"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                      >
                        <option value="">Nhóm máu</option>
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
                    <div className="col-md-6 mb-3">
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        placeholder="Ngày mong muốn"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <select
                      className="form-select form-select-lg"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn địa điểm</option>
                      <option value="central">Bệnh viện Đa khoa Trung ương</option>
                      <option value="hematology">Trung tâm Huyết học Quốc gia</option>
                      <option value="choray">Bệnh viện Chợ Rẫy</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold">
                    <i className="fas fa-heart me-2"></i>
                    Đăng Ký Ngay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuickDonationForm; 