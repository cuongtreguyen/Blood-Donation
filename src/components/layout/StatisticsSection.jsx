import React from 'react';

/**
 * Component hiển thị thống kê về hoạt động hiến máu
 * Hiển thị các số liệu quan trọng như:
 * - Số người hiến máu
 * - Số đơn vị máu thu được
 * - Số người được cứu sống
 * - Số điểm hiến máu
 */
function StatisticsSection() {
  // Mảng chứa các thông tin thống kê
  const stats = [
    {
      number: '15,000+', // Số liệu thống kê
      label: 'Người hiến máu', // Nhãn mô tả
      icon: '👥' // Icon minh họa
    },
    {
      number: '45,000+',
      label: 'Đơn vị máu thu được',
      icon: '🩸'
    },
    {
      number: '135,000+',
      label: 'Người được cứu sống',
      icon: '❤️'
    },
    {
      number: '50+',
      label: 'Điểm hiến máu',
      icon: '📍'
    }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Grid hiển thị các thống kê */}
        <div className="row text-center">
          {/* Map qua mảng stats để render từng thống kê */}
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              {/* Card cho mỗi thống kê */}
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body py-5">
                  {/* Icon minh họa */}
                  <div className="fs-1 mb-3">{stat.icon}</div>
                  {/* Số liệu thống kê */}
                  <h3 className="fw-bold text-danger mb-2">{stat.number}</h3>
                  {/* Nhãn mô tả */}
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatisticsSection; 