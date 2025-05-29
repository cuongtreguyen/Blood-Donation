import React from 'react';

function BloodTypesSection() {
  const bloodTypes = [
    { type: 'O-', compatibility: 'Người cho máu toàn năng', color: 'success' },
    { type: 'O+', compatibility: 'Có thể cho nhóm máu dương', color: 'info' },
    { type: 'A-', compatibility: 'Cho A-, A+, AB-, AB+', color: 'warning' },
    { type: 'A+', compatibility: 'Cho A+, AB+', color: 'primary' },
    { type: 'B-', compatibility: 'Cho B-, B+, AB-, AB+', color: 'secondary' },
    { type: 'B+', compatibility: 'Cho B+, AB+', color: 'dark' },
    { type: 'AB-', compatibility: 'Cho AB-, AB+', color: 'danger' },
    { type: 'AB+', compatibility: 'Người nhận máu toàn năng', color: 'success' }
  ];

  return (
    <section  className="py-5 bg-light scroll-mt-24">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-danger mb-3">Thông Tin Nhóm Máu</h2>
          <p className="lead text-muted">Tìm hiểu về các nhóm máu và khả năng tương thích</p>
        </div>
        <div className="row">
          {bloodTypes.map((blood, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-3">
              <div className={`card border-0 bg-${blood.color} text-white h-100`}>
                <div className="card-body text-center">
                  <h3 className="fw-bold mb-2">{blood.type}</h3>
                  <p className="mb-0 small">{blood.compatibility}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BloodTypesSection;
