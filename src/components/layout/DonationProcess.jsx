import React from 'react';

function DonationProcess() {
  const steps = [
    {
      step: '01',
      title: 'Đăng Ký',
      description: 'Đăng ký trực tuyến hoặc đến trực tiếp tại các điểm hiến máu',
      icon: '📝'
    },
    {
      step: '02',
      title: 'Khám Sàng Lọc',
      description: 'Kiểm tra sức khỏe tổng quát và thông tin cá nhân',
      icon: '🩺'
    },
    {
      step: '03',
      title: 'Hiến Máu',
      description: 'Quy trình hiến máu an toàn và nhanh chóng chỉ trong 10-15 phút',
      icon: '🩸'
    },
    {
      step: '04',
      title: 'Nghỉ Ngơi',
      description: 'Nghỉ ngơi và thưởng thức đồ ăn nhẹ sau khi hiến máu',
      icon: '☕'
    }
  ];

  return (
    <section id="donation-process" className="py-5 scroll-mt-24">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-danger mb-3">Quy Trình Hiến Máu</h2>
          <p className="lead text-muted">Quy trình hiến máu đơn giản và an toàn</p>
        </div>
        <div className="row">
          {steps.map((step, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm position-relative">
                <div className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 rounded-bottom fw-bold">
                  {step.step}
                </div>
                <div className="card-body text-center pt-5">
                  <div className="fs-1 mb-3">{step.icon}</div>
                  <h5 className="fw-bold mb-3">{step.title}</h5>
                  <p className="text-muted">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DonationProcess;
