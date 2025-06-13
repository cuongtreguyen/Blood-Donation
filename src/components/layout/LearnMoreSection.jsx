import React from "react";
import { Card, Row, Col, Timeline } from "antd";
import { HeartOutlined, QuestionCircleOutlined } from "@ant-design/icons";

function LearnMoreSection() {
  const requirements = [
    { title: "Độ tuổi", content: "18-60 tuổi" },
    { title: "Cân nặng", content: "Nam ≥ 45kg, Nữ ≥ 42kg" },
    {
      title: "Sức khỏe",
      content: "Không mắc các bệnh truyền nhiễm, tim mạch, huyết áp",
    },
    { title: "Thời gian", content: "Nam 3 tháng/lần, Nữ 4 tháng/lần" },
  ];

  const process = [
    {
      title: "Đăng ký và điền thông tin",
      description: "Điền form đăng ký và cung cấp thông tin cá nhân",
    },
    {
      title: "Khám sàng lọc",
      description: "Bác sĩ kiểm tra sức khỏe và các chỉ số quan trọng",
    },
    {
      title: "Hiến máu",
      description: "Quá trình hiến máu diễn ra trong 7-10 phút",
    },
    { title: "Nghỉ ngơi", description: "Nghỉ ngơi và ăn nhẹ trong 15 phút" },
  ];

  const benefits = [
    "Được kiểm tra sức khỏe miễn phí",
    "Biết được nhóm máu của mình",
    "Được cấp giấy chứng nhận hiến máu",
    "Được tư vấn về sức khỏe",
    "Góp phần cứu sống người bệnh",
  ];

  const faqs = [
    {
      question: "Hiến máu có đau không?",
      answer:
        "Hiến máu chỉ gây đau nhẹ như kiểm tra đường huyết. Nhân viên y tế được đào tạo để giảm thiểu sự khó chịu.",
    },
    {
      question: "Hiến máu có ảnh hưởng đến sức khỏe không?",
      answer:
        "Không, cơ thể sẽ tự bổ sung lượng máu đã hiến trong vòng vài ngày. Bạn có thể sinh hoạt bình thường sau 24 giờ.",
    },
    {
      question: "Cần chuẩn bị gì trước khi hiến máu?",
      answer:
        "Ngủ đủ giấc, ăn nhẹ và uống nhiều nước. Không uống rượu bia 24 giờ trước khi hiến máu.",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-14 text-red-600">
          Thông Tin Về Hiến Máu
        </h2>

        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24}>
            <Card title="Điều Kiện Hiến Máu" className="shadow-lg rounded-2xl">
              <Row gutter={[16, 16]}>
                {requirements.map((req, index) => (
                  <Col xs={24} sm={12} md={6} key={index}>
                    <Card.Grid
                      style={{ width: "100%", padding: 20 }}
                      className="text-center hover:bg-red-50"
                    >
                      <h4 className="text-lg font-bold text-red-600 mb-2">
                        {req.title}
                      </h4>
                      <p className="text-gray-700">{req.content}</p>
                    </Card.Grid>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24} md={12}>
            <Card
              title="Quy Trình Hiến Máu"
              className="shadow-lg rounded-2xl h-full"
            >
              <Timeline
                items={process.map((step, index) => ({
                  color: "red",
                  children: (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-800">
                        {step.title}
                      </h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title="Lợi Ích Khi Hiến Máu"
              className="shadow-lg rounded-2xl h-full"
            >
              <ul className="list-none">
                {benefits.map((benefit, index) => (
                  <li key={index} className="mb-4 flex items-start">
                    <HeartOutlined className="text-red-500 mr-3 mt-1 text-base" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs={24}>
            <Card title="Câu Hỏi Thường Gặp" className="shadow-lg rounded-2xl">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h4 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
                    <QuestionCircleOutlined className="text-red-500 mr-2" />
                    {faq.question}
                  </h4>
                  <p className="ml-6 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default LearnMoreSection;
