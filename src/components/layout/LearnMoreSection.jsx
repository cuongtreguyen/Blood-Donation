// import React from "react";
// import { Card, Row, Col, Timeline } from "antd";
// import { HeartOutlined, QuestionCircleOutlined } from "@ant-design/icons";

// function LearnMoreSection() {
//   const requirements = [
//     { title: "Độ tuổi", content: "18-60 tuổi" },
//     { title: "Cân nặng", content: "Nam ≥ 45kg, Nữ ≥ 42kg" },
//     {
//       title: "Sức khỏe",
//       content: "Không mắc các bệnh truyền nhiễm, tim mạch, huyết áp",
//     },
//     { title: "Thời gian", content: "Nam 3 tháng/lần, Nữ 4 tháng/lần" },
//   ];

//   const process = [
//     {
//       title: "Đăng ký và điền thông tin",
//       description: "Điền form đăng ký và cung cấp thông tin cá nhân",
//     },
//     {
//       title: "Khám sàng lọc",
//       description: "Bác sĩ kiểm tra sức khỏe và các chỉ số quan trọng",
//     },
//     {
//       title: "Hiến máu",
//       description: "Quá trình hiến máu diễn ra trong 7-10 phút",
//     },
//     { title: "Nghỉ ngơi", description: "Nghỉ ngơi và ăn nhẹ trong 15 phút" },
//   ];

//   const benefits = [
//     "Được kiểm tra sức khỏe miễn phí",
//     "Biết được nhóm máu của mình",
//     "Được cấp giấy chứng nhận hiến máu",
//     "Được tư vấn về sức khỏe",
//     "Góp phần cứu sống người bệnh",
//   ];

//   const faqs = [
//     {
//       question: "Hiến máu có đau không?",
//       answer:
//         "Hiến máu chỉ gây đau nhẹ như kiểm tra đường huyết. Nhân viên y tế được đào tạo để giảm thiểu sự khó chịu.",
//     },
//     {
//       question: "Hiến máu có ảnh hưởng đến sức khỏe không?",
//       answer:
//         "Không, cơ thể sẽ tự bổ sung lượng máu đã hiến trong vòng vài ngày. Bạn có thể sinh hoạt bình thường sau 24 giờ.",
//     },
//     {
//       question: "Cần chuẩn bị gì trước khi hiến máu?",
//       answer:
//         "Ngủ đủ giấc, ăn nhẹ và uống nhiều nước. Không uống rượu bia 24 giờ trước khi hiến máu.",
//     },
//   ];

//   return (
//     <div className="py-16 bg-gray-50">
//       <div className="container mx-auto px-4 max-w-6xl">
//         <h2 className="text-4xl font-bold text-center mb-14 text-red-600">
//           Thông Tin Về Hiến Máu
//         </h2>

//         <Row gutter={[24, 24]} className="mb-12">
//           <Col xs={24}>
//             <Card title="Điều Kiện Hiến Máu" className="shadow-lg rounded-2xl">
//               <Row gutter={[16, 16]}>
//                 {requirements.map((req, index) => (
//                   <Col xs={24} sm={12} md={6} key={index}>
//                     <Card.Grid
//                       style={{ width: "100%", padding: 20 }}
//                       className="text-center hover:bg-red-50"
//                     >
//                       <h4 className="text-lg font-bold text-red-600 mb-2">
//                         {req.title}
//                       </h4>
//                       <p className="text-gray-700">{req.content}</p>
//                     </Card.Grid>
//                   </Col>
//                 ))}
//               </Row>
//             </Card>
//           </Col>
//         </Row>

//         <Row gutter={[24, 24]} className="mb-12">
//           <Col xs={24} md={12}>
//             <Card
//               title="Quy Trình Hiến Máu"
//               className="shadow-lg rounded-2xl h-full"
//             >
//               <Timeline
//                 items={process.map((step, index) => ({
//                   color: "red",
//                   children: (
//                     <div key={index}>
//                       <h4 className="font-semibold text-gray-800">
//                         {step.title}
//                       </h4>
//                       <p className="text-gray-600">{step.description}</p>
//                     </div>
//                   ),
//                 }))}
//               />
//             </Card>
//           </Col>

//           <Col xs={24} md={12}>
//             <Card
//               title="Lợi Ích Khi Hiến Máu"
//               className="shadow-lg rounded-2xl h-full"
//             >
//               <ul className="list-none">
//                 {benefits.map((benefit, index) => (
//                   <li key={index} className="mb-4 flex items-start">
//                     <HeartOutlined className="text-red-500 mr-3 mt-1 text-base" />
//                     <span className="text-gray-700">{benefit}</span>
//                   </li>
//                 ))}
//               </ul>
//             </Card>
//           </Col>
//         </Row>

//         <Row>
//           <Col xs={24}>
//             <Card title="Câu Hỏi Thường Gặp" className="shadow-lg rounded-2xl">
//               {faqs.map((faq, index) => (
//                 <div key={index} className="mb-6 last:mb-0">
//                   <h4 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
//                     <QuestionCircleOutlined className="text-red-500 mr-2" />
//                     {faq.question}
//                   </h4>
//                   <p className="ml-6 text-gray-600">{faq.answer}</p>
//                 </div>
//               ))}
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// }

// export default LearnMoreSection;







import React from "react";
import { Card, Row, Col, Timeline, Collapse } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  FormOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  CoffeeOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

function LearnMoreSection() {
  const requirements = [
    { title: "Độ tuổi", content: "18-60 tuổi", icon: <UserOutlined className="text-3xl text-sky-600" /> },
    { title: "Cân nặng", content: "Nam ≥ 45kg, Nữ ≥ 42kg", icon: <HeartOutlined className="text-3xl text-sky-600" /> },
    { title: "Sức khỏe", content: "Không mắc bệnh truyền nhiễm...", icon: <SafetyCertificateOutlined className="text-3xl text-sky-600" /> },
    { title: "Thời gian", content: "Nam 3 tháng/lần, Nữ 4 tháng/lần", icon: <ClockCircleOutlined className="text-3xl text-sky-600" /> },
  ];

  const process = [
    {
      title: "Đăng ký và điền thông tin",
      description: "Điền form đăng ký và cung cấp thông tin cá nhân",
      dot: <FormOutlined className="text-xl text-sky-600" />,
    },
    {
      title: "Khám sàng lọc",
      description: "Bác sĩ kiểm tra sức khỏe và các chỉ số quan trọng",
      dot: <ExperimentOutlined className="text-xl text-sky-600" />,
    },
    {
      title: "Hiến máu",
      description: "Quá trình hiến máu diễn ra trong 7-10 phút",
      dot: <MedicineBoxOutlined className="text-xl text-sky-600" />,
    },
    { 
      title: "Nghỉ ngơi và nhận quà", 
      description: "Nghỉ ngơi, ăn nhẹ và nhận giấy chứng nhận",
      dot: <CoffeeOutlined className="text-xl text-sky-600" /> 
    },
  ];

  const benefits = [
    "Được kiểm tra sức khỏe tổng quát miễn phí.",
    "Sàng lọc các bệnh lây truyền qua đường máu.",
    "Giảm tải sắt trong cơ thể, tốt cho tim mạch.",
    "Tạo ra tế bào máu mới, giúp cơ thể khỏe mạnh hơn.",
    "Nhận giấy chứng nhận và quà tặng ý nghĩa.",
    "Quan trọng nhất: Cứu sống người bệnh trong cơn nguy kịch.",
  ];

  const faqs = [
    {
      key: '1',
      question: "Hiến máu có đau không?",
      answer: "Cảm giác chỉ như một vết kiến cắn nhẹ khi kim được đưa vào. Các kỹ thuật viên được đào tạo chuyên nghiệp để giảm thiểu sự khó chịu và đảm bảo quá trình diễn ra êm ái.",
    },
    {
      key: '2',
      question: "Hiến máu có ảnh hưởng đến sức khỏe không?",
      answer: "Hoàn toàn không. Lượng máu hiến sẽ được cơ thể tái tạo nhanh chóng trong vòng vài ngày. Bạn có thể sinh hoạt bình thường ngay sau khi hiến máu, chỉ cần tránh các hoạt động thể chất quá sức trong 24 giờ đầu.",
    },
    {
      key: '3',
      question: "Cần chuẩn bị gì trước khi hiến máu?",
      answer: "Đêm trước khi hiến máu cần ngủ đủ giấc. Ăn nhẹ (không ăn đồ nhiều dầu mỡ) và uống nhiều nước trước khi đi. Tránh sử dụng rượu bia ít nhất 24 giờ và mang theo giấy tờ tùy thân.",
    },
  ];

  return (
    // Nền gradient tinh tế với màu sắc lạnh
    <div className="py-20 px-4 bg-gradient-to-br from-slate-50 to-sky-100">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent pb-2">
            Tìm Hiểu Về Hiến Máu Nhân Đạo
          </h2>
          <p className="text-slate-600 mt-4 text-lg max-w-3xl mx-auto">
            Mỗi giọt máu cho đi là một cuộc đời ở lại. Khám phá quy trình, lợi ích và điều kiện để trở thành người hùng thầm lặng.
          </p>
        </div>

        {/* Section 1: Điều kiện hiến máu */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-800 text-center mb-8">Điều kiện cần thiết để hiến máu</h3>
          <Row gutter={[24, 24]}>
            {requirements.map((req, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                {/* Hiệu ứng Glassmorphism và hover */}
                <div className="p-8 text-center bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg shadow-sky-100/50 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-200/50">
                  <div className="mb-4">{req.icon}</div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">
                    {req.title}
                  </h4>
                  <p className="text-slate-600">{req.content}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section 2: Quy trình và Lợi ích */}
        <Row gutter={[40, 40]} className="mb-16 items-stretch">
          <Col xs={24} lg={12}>
            <div className="p-8 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg shadow-sky-100/50 h-full">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">Quy Trình 4 Bước Đơn Giản</h3>
              <Timeline
                items={process.map((step) => ({
                  dot: step.dot,
                  children: (
                    <div className="pb-4">
                      <h4 className="font-semibold text-slate-700">
                        {step.title}
                      </h4>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  ),
                }))}
              />
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="p-8 bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg shadow-sky-100/50 h-full">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">Những Lợi Ích Vàng</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleOutlined className="text-teal-500 mr-3 mt-1 text-lg" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
        
        {/* Section 3: Câu hỏi thường gặp - Dùng Collapse */}
        <div>
          <h3 className="text-2xl font-semibold text-slate-800 text-center mb-8">Giải Đáp Thắc Mắc</h3>
          <div className="max-w-4xl mx-auto">
             <Collapse 
                accordion 
                bordered={false} 
                className="bg-transparent"
                expandIcon={({ isActive }) => <QuestionCircleOutlined className={`transition-transform ${isActive ? 'rotate-180' : ''}`} />}
             >
              {faqs.map((faq) => (
                <Panel 
                  header={<span className="font-semibold text-lg text-slate-800">{faq.question}</span>} 
                  key={faq.key}
                  className="bg-white/50 backdrop-blur-lg rounded-2xl mb-4 !border-none shadow-md shadow-sky-100/50"
                >
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LearnMoreSection;