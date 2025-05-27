import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Select, Row, Col, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";

const { Title, Text, Link: AntdLink } = Typography;

const bloodGroups = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

   const [isDarkMode, setIsDarkMode] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
 
   const onFinish = (values) => {
     setIsLoading(true);
     console.log("Form Values:", values);
     setTimeout(() => {
       setIsLoading(false);
     }, 2000);
   };
  return (
  <div className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Left Column - Login Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-8">
          <div className="flex  items-center space-x-2">
            <img
              src="https://images.unsplash.com/photo-1615461066841-6116e61058f4"
              alt="Logo"
              className="w-10 h-10 rounded-full"
            />
            <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Blood Donation Support
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <IoLanguage className={`${isDarkMode ? "text-white" : "text-gray-600"}`} />
            </button>
          </div>
        </div>

        <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Họ và tên *"
              name="fullname"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email *"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email" }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Mật khẩu *"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Xác nhận mật khẩu *"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nhóm máu"
              name="bloodGroup"
              rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
            >
              <Select placeholder="Chọn nhóm máu" options={bloodGroups} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input.TextArea placeholder="Nhập địa chỉ" autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản!')),
            },
          ]}
        >
          <Checkbox>
            Tôi đồng ý với <AntdLink href="#" style={{ color: "#d32f2f" }}>điều khoản sử dụng</AntdLink> và <AntdLink href="#" style={{ color: "#d32f2f" }}>chính sách bảo mật</AntdLink>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              background: "#d32f2f",
              borderColor: "#d32f2f",
              fontWeight: 500,
              fontSize: 18,
              height: 48,
              marginBottom: 8,
            }}
          >
            Đăng Ký
          </Button>
          <Button
            style={{
              width: "100%",
              borderColor: "#ccc",
              fontWeight: 500,
              fontSize: 18,
              height: 48,
              marginBottom: 16,
            }}
            onClick={() => form.resetFields()}
          >
            Hủy
          </Button>
        </Form.Item>

      </Form>

        
      </div>

      {/* Right Column - Image */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4"
          alt="Blood Donation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0  opacity-[0.5] bg-red-600 bg-opacity-40 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Give the Gift of Life
            </h2>
            <p className="text-xl text-white">
              "Your donation can save up to three lives. Be a hero today."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;