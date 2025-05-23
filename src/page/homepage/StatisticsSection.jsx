import React from 'react';

// Statistics Section
function StatisticsSection() {
  const stats = [
    { number: '15,000+', label: 'Người hiến máu', icon: '👥' },
    { number: '45,000+', label: 'Đơn vị máu thu được', icon: '🩸' },
    { number: '135,000+', label: 'Người được cứu sống', icon: '❤️' },
    { number: '50+', label: 'Điểm hiến máu', icon: '📍' }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row text-center">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body py-5">
                  <div className="fs-1 mb-3">{stat.icon}</div>
                  <h3 className="fw-bold text-danger mb-2">{stat.number}</h3>
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