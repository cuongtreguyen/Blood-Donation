import React from 'react';

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Nguyễn Văn Minh",
      role: "Người hiến máu thường xuyên",
      content: "Tôi đã hiến máu hơn 20 lần tại đây. Dịch vụ chuyên nghiệp, nhân viên tận tâm. Cảm ơn vì đã tạo điều kiện cho chúng tôi làm việc tốt.",
      avatar: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-1/483609406_1142898187535579_4808174474482755062_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=kcDF5vgCjEkQ7kNvwEW4k5o&_nc_oc=AdkGd_ZZEZFHlh9_GkopF_nZODRSEjc-HBtKey5oNZ5jSSUzXwZEHc8BxUKXgXwHbJw&_nc_zt=24&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=CnVDV64TulEANggbCpP2tQ&oh=00_AfO8iCV1owm66gFqvQEdgqtFYR-byGtysRbq6D45o7D2Lg&oe=684743E9"
    },
    {
      name: "Trần Thị Hoa",
      role: "Bệnh nhân được cứu sống",
      content: "Nhờ có máu hiến tặng, tôi đã vượt qua ca phẫu thuật khó khăn. Tôi vô cùng biết ơn những người hiến máu tình nguyện.",
      avatar: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/341128599_549182920623736_5160836108154107558_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=Q7a6rZZIKMIQ7kNvwFCU_gQ&_nc_oc=AdkVo0MSYMzIJO_sWQapw2TGeCu-CcAV1T315y4zkDlALIo2x4Htial16Y9lMG2_TEE&_nc_zt=24&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=aoZSch1q6oUD4AoPHd9P1Q&oh=00_AfNdi4Y8U16IJsMKJEDWtL4iF5tiIJyxzOzdtzzJXBWB-A&oe=684731FB"
    },
    {
      name: "Lê Hoàng Nam",
      role: "Bác sĩ điều trị",
      content: "Chất lượng máu từ trung tâm luôn đảm bảo tiêu chuẩn cao nhất. Điều này rất quan trọng trong việc điều trị bệnh nhân.",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=c...rop=face"
    }
  ];

  return (
    <section id="blog-customer" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-danger mb-3">Câu Chuyện Chia Sẻ</h2>
          <p className="lead text-muted">Lời cảm ơn từ cộng đồng</p>
        </div>
        <div className="row">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="text-warning mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
<p className="mb-4 fst-italic">"{testimonial.content}"</p>
                  <div className="d-flex align-items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="rounded-circle me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
