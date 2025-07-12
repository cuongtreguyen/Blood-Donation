// import React from 'react';

// // Testimonials Section
// function TestimonialsSection() {
//   const testimonials = [
//     {
//       name: "Nguyễn Văn Minh",
//       role: "Người hiến máu thường xuyên",
//       content: "Tôi đã hiến máu hơn 20 lần tại đây. Dịch vụ chuyên nghiệp, nhân viên tận tâm. Cảm ơn vì đã tạo điều kiện cho chúng tôi làm việc tốt.",
//       avatar: "https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-1/514261186_1421226419221706_1763570345444575431_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_ohc=tuW7umON4aUQ7kNvwEwvPo0&_nc_oc=AdkV0iEXgGnV2SmbplciYUM721KlYLykEZMt1l6wQJAyukFRDRuPNPf6RjRF-PLrHxo&_nc_zt=24&_nc_ht=scontent.fsgn5-8.fna&_nc_gid=rM10zXJM_MRw9IT7dIRm1w&oh=00_AfRNdRgWq2-j6sSf8r26cdmk4bpJXHfQpq7BYiVAWwt6jA&oe=6876A122"
//     },
//     {
//       name: "Trần Thị Hoa",
//       role: "Bệnh nhân được cứu sống",
//       content: "Nhờ có máu hiến tặng, tôi đã vượt qua ca phẫu thuật khó khăn. Tôi vô cùng biết ơn những người hiến máu tình nguyện.",
//       avatar: "https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-1/341128599_549182920623736_5160836108154107558_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=6zGCJpqj1joQ7kNvwH1dq6u&_nc_oc=AdmsbSebymEAEKfUKSLOQP0dzxmOYLdg232Pccsbrzao0PBTigj6C2-i7vGL3TWwWmg&_nc_zt=24&_nc_ht=scontent.fsgn5-12.fna&_nc_gid=3DRroxQIrsbfIDfUgHWlJg&oh=00_AfRfwE47F9ZxF6jV5MTXQxT-weUgPc0pAjWoSKHECBHkZg&oe=6876A7FB"
//     },
//     {
//       name: "Lê Hoàng Nam",
//       role: "Bác sĩ điều trị",
//       content: "Chất lượng máu từ trung tâm luôn đảm bảo tiêu chuẩn cao nhất. Điều này rất quan trọng trong việc điều trị bệnh nhân.",
//       avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=c...rop=face"
//     }
//   ];

//   return (
//     <section id="blog-customer" className="py-5">
//       <div className="container">
//         <div className="text-center mb-5">
//           <h2 className="fw-bold text-danger mb-3">Câu Chuyện Chia Sẻ</h2>
//           <p className="lead text-muted">Lời cảm ơn từ cộng đồng</p>
//         </div>
//         <div className="row">
//           {testimonials.map((testimonial, index) => (
//             <div key={index} className="col-lg-4 mb-4">
//               <div className="card h-100 border-0 shadow-sm">
//                 <div className="card-body p-4">
//                   <div className="text-warning mb-3">
//                     <i className="fas fa-star"></i>
//                     <i className="fas fa-star"></i>
//                     <i className="fas fa-star"></i>
//                     <i className="fas fa-star"></i>
//                     <i className="fas fa-star"></i>
//                   </div>
// <p className="mb-4 fst-italic">"{testimonial.content}"</p>
//                   <div className="d-flex align-items-center">
//                     <img 
//                       src={testimonial.avatar} 
//                       alt={testimonial.name}
//                       className="rounded-circle me-3"
//                       style={{ width: '50px', height: '50px', objectFit: 'cover' }}
//                     />
//                     <div>
//                       <h6 className="fw-bold mb-0">{testimonial.name}</h6>
//                       <small className="text-muted">{testimonial.role}</small>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default TestimonialsSection;




import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Nguyễn Văn Minh",
      role: "Người hiến máu thường xuyên",
      content: "Tôi đã hiến máu hơn 20 lần tại đây. Dịch vụ chuyên nghiệp, nhân viên tận tâm. Cảm ơn vì đã tạo điều kiện cho chúng tôi làm việc tốt.",
      avatar: "https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-1/514261186_1421226419221706_1763570345444575431_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_ohc=tuW7umON4aUQ7kNvwEwvPo0&_nc_oc=AdkV0iEXgGnV2SmbplciYUM721KlYLykEZMt1l6wQJAyukFRDRuPNPf6RjRF-PLrHxo&_nc_zt=24&_nc_ht=scontent.fsgn5-8.fna&_nc_gid=rM10zXJM_MRw9IT7dIRm1w&oh=00_AfRNdRgWq2-j6sSf8r26cdmk4bpJXHfQpq7BYiVAWwt6jA&oe=6876A122"
    },
    {
      name: "Trần Thị Hoa",
      role: "Bệnh nhân được cứu sống",
      content: "Nhờ có máu hiến tặng, tôi đã vượt qua ca phẫu thuật khó khăn. Tôi vô cùng biết ơn những người hiến máu tình nguyện.",
      avatar: "https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-1/341128599_549182920623736_5160836108154107558_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=6zGCJpqj1joQ7kNvwH1dq6u&_nc_oc=AdmsbSebymEAEKfUKSLOQP0dzxmOYLdg232Pccsbrzao0PBTigj6C2-i7vGL3TWwWmg&_nc_zt=24&_nc_ht=scontent.fsgn5-12.fna&_nc_gid=3DRroxQIrsbfIDfUgHWlJg&oh=00_AfRfwE47F9ZxF6jV5MTXQxT-weUgPc0pAjWoSKHECBHkZg&oe=6876A7FB"
    },
    {
      name: "Lê Hoàng Nam",
      role: "Bác sĩ điều trị",
      content: "Chất lượng máu từ trung tâm luôn đảm bảo tiêu chuẩn cao nhất. Điều này rất quan trọng trong việc điều trị bệnh nhân.",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150"
    }
  ];

  const [index, setIndex] = useState(0);

  // Tự động chuyển testimonial sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="py-12 px-4 md:px-20 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-2 text-red-600">Câu Chuyện Chia Sẻ</h2>
      <p className="text-gray-600 mb-10">Lời cảm ơn từ cộng đồng</p>

      <div className="relative w-full max-w-xl mx-auto h-80 overflow-hidden">
        <AnimatePresence custom={1} exitBeforeEnter>
          <motion.div
            key={index}
            className="absolute w-full h-full px-4"
            custom={1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white shadow-lg p-6 rounded-xl h-full flex flex-col items-center justify-center">
              <img
                src={testimonials[index].avatar}
                alt={testimonials[index].name}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
              <p className="italic text-gray-700 mb-4">"{testimonials[index].content}"</p>
              <h4 className="font-bold text-lg text-red-500">{testimonials[index].name}</h4>
              <p className="text-sm text-gray-500">{testimonials[index].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default TestimonialsSection;

