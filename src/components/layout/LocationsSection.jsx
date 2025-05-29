import React from 'react';

// Locations Section
function LocationsSection() {
  const locations = [
    {
      name: 'Bệnh viện Đa khoa Trung ương',
      address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      hours: '8:00 - 17:00 (Thứ 2 - Chủ nhật)',
      phone: '(028) 3825 2525'
    },
    {
      name: 'Trung tâm Huyết học Quốc gia',
      address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      hours: '7:30 - 16:30 (Thứ 2 - Thứ 7)',
      phone: '(028) 3829 7070'
    },
    {
      name: 'Bệnh viện Chợ Rẫy',
      address: '201B Đường Nguyễn Chí Thanh, Quận 5, TP.HCM',
      hours: '8:00 - 16:00 (Thứ 2 - Thứ 6)',
      phone: '(028) 3855 4269'
    }
  ];

  return (
    <section id="donation-centers" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-danger mb-3">Địa Điểm Hiến Máu</h2>
          <p className="lead text-muted">Các điểm thu gom máu gần bạn</p>
        </div>
        <div className="row">
          {locations.map((location, index) => (
            <div key={index} className="col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold text-danger mb-3">{location.name}</h5>
                  <div className="mb-2">
                    <i className="fas fa-map-marker-alt text-danger me-2"></i>
                    <span>{location.address}</span>
                  </div>
                  <div className="mb-2">
                    <i className="fas fa-clock text-danger me-2"></i>
                    <span>{location.hours}</span>
                  </div>
                  <div className="mb-3">
                    <i className="fas fa-phone text-danger me-2"></i>
                    <span>{location.phone}</span>
                  </div>
                  <button className="btn btn-outline-danger w-100">
                    Chỉ Đường
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LocationsSection; 