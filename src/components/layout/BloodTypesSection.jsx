import React from 'react';
//tài liệu về máu 
function BloodTypesSection() {
  const bloodTypes = [
    { type: 'O-', compatibility: 'Người cho máu toàn năng', color: 'success', description: 'Có thể cho tất cả các nhóm máu khác, nhưng chỉ có thể nhận O-' },
    { type: 'O+', compatibility: 'Có thể cho nhóm máu dương', color: 'info', description: 'Có thể cho tất cả các nhóm máu Rh dương và nhận từ O+, O-' },
    { type: 'A-', compatibility: 'Cho A-, A+, AB-, AB+', color: 'warning', description: 'Có thể cho các nhóm máu A và AB, nhận từ A- và O-' },
    { type: 'A+', compatibility: 'Cho A+, AB+', color: 'primary', description: 'Có thể cho A+ và AB+, nhận từ A+, A-, O+, O-' },
    { type: 'B-', compatibility: 'Cho B-, B+, AB-, AB+', color: 'secondary', description: 'Có thể cho các nhóm máu B và AB, nhận từ B- và O-' },
    { type: 'B+', compatibility: 'Cho B+, AB+', color: 'dark', description: 'Có thể cho B+ và AB+, nhận từ B+, B-, O+, O-' },
    { type: 'AB-', compatibility: 'Cho AB-, AB+', color: 'danger', description: 'Có thể cho AB- và AB+, nhận từ tất cả nhóm máu âm' },
    { type: 'AB+', compatibility: 'Người nhận máu toàn năng', color: 'success', description: 'Có thể nhận từ tất cả các nhóm máu, nhưng chỉ có thể cho AB+' }
  ];

  const bloodComponents = [
    {
      name: 'Hồng cầu',
      description: 'Thành phần chính vận chuyển oxy trong máu',
      storageTime: '42 ngày',
      usedFor: 'Điều trị thiếu máu, mất máu cấp tính',
      icon: '🔴'
    },
    {
      name: 'Tiểu cầu',
      description: 'Tế bào giúp đông máu và cầm máu',
      storageTime: '5 ngày',
      usedFor: 'Điều trị xuất huyết, giảm tiểu cầu',
      icon: '🟡'
    },
    {
      name: 'Huyết tương',
      description: 'Phần dịch của máu chứa protein và yếu tố đông máu',
      storageTime: '1 năm (đông lạnh)',
      usedFor: 'Điều trị rối loạn đông máu, bỏng',
      icon: '💛'
    },
    {
      name: 'Bạch cầu',
      description: 'Tế bào miễn dịch bảo vệ cơ thể',
      storageTime: 'Không lưu trữ riêng',
      usedFor: 'Là một phần của máu toàn phần',
      icon: '⚪'
    }
  ];

  return (
    <section id="document-blood" className="py-5 bg-light scroll-mt-24">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-danger mb-3">Thông Tin Nhóm Máu và Thành Phần Máu</h2>
          <p className="lead text-muted">Tìm hiểu về các nhóm máu, khả năng tương thích và thành phần máu</p>
        </div>

        {/* Blood Types Section */}
        <h3 className="fw-bold text-danger mb-4">Các Nhóm Máu và Tương Thích</h3>
        <div className="row g-4 mb-5">
          {bloodTypes.map((blood, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className={`card-header bg-${blood.color} text-white`}>
                  <h4 className="fw-bold mb-0">{blood.type}</h4>
                </div>
                <div className="card-body">
                  <h6 className="fw-bold mb-2">{blood.compatibility}</h6>
                  <p className="small text-muted mb-0">{blood.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blood Components Section */}
        <h3 className="fw-bold text-danger mb-4">Thành Phần Máu</h3>
        <div className="row g-4">
          {bloodComponents.map((component, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <span className="fs-2 me-2">{component.icon}</span>
                    <h5 className="fw-bold mb-0">{component.name}</h5>
                  </div>
                  <p className="text-muted mb-2">{component.description}</p>
                  <div className="small">
                    <p className="mb-1"><strong>Thời gian lưu trữ:</strong> {component.storageTime}</p>
                    <p className="mb-0"><strong>Công dụng:</strong> {component.usedFor}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="alert alert-info mt-5">
          <h5 className="fw-bold">Lưu ý quan trọng:</h5>
          <ul className="mb-0">
            <li>Một người có thể hiến máu toàn phần 3-4 tháng một lần</li>
            <li>Hiến tiểu cầu có thể thực hiện thường xuyên hơn, khoảng 2 tuần một lần</li>
            <li>Huyết tương có thể được hiến thường xuyên hơn các thành phần khác</li>
            <li>Luôn kiểm tra với bác sĩ về khả năng hiến máu của bạn</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default BloodTypesSection;
