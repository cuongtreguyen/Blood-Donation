import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Row,
  Col,
  Typography,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";

const { Title, Text, Link: AntdLink } = Typography;

const bloodGroups = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
];

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    console.log("Form Values:", values);

    try {
      const userData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        bloodType: values.bloodType,
      };

      console.log("Data to send:", userData);

      const response = await api.post("register", userData);

      if (response.status === 200) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        form.resetFields();
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 400) {
        toast.error("Thông tin đăng ký không hợp lệ!");
      } else if (error.response?.status === 401) {
        toast.error("Email đã được sử dụng!");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <img
              src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
              alt="Logo"
              className="w-10 h-10 rounded-full"
            />
            <h1
              style={{ color: "red" }}
              className={`text-2xl font-bold ${
                isDarkMode ? "text-red-500" : "text-gray-800"
              }`}
            >
              Dòng Máu Việt
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-700 text-yellow-400"
                  : " hover:bg-gray-200 text-gray-600"
              }`}
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-700"}
                    >
                      Họ và tên *
                    </span>
                  }
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                    { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
                  ]}
                >
                  <Input
                    placeholder="Nhập họ và tên"
                    className={
                      isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                {/* <Form.Item
                  label={<span className={isDarkMode ? "text-white" : "text-gray-700"}>Email *</span>}
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input
                    placeholder="example@email.com"
                    className={isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""}
                  />
                </Form.Item> */}
                <Form.Item
                  label={
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-700"}
                    >
                      Email *
                    </span>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    {
                      pattern: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/,
                      message: "Email không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    placeholder="example@email.com"
                    className={
                      isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                {/* <Form.Item
                  label={<span className={isDarkMode ? "text-white" : "text-gray-700"}>Mật khẩu *</span>}
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu"
                    className={isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""}
                  />
                </Form.Item> */}
                <Form.Item
                  label={
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-700"}
                    >
                      Mật khẩu *
                    </span>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,20}$/,
                      message:
                        "Mật khẩu phải từ 8-20 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu"
                    className={
                      isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                {/* <Form.Item
                  label={<span className={isDarkMode ? "text-white" : "text-gray-700"}>Xác nhận mật khẩu *</span>}
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
                  <Input.Password
                    placeholder="Nhập lại mật khẩu"
                    className={isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""}
                  />
                </Form.Item> */}
                <Form.Item
                  label={
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-700"}
                    >
                      Xác nhận mật khẩu *
                    </span>
                  }
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập lại mật khẩu"
                    className={
                      isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-700"}
                    >
                      Số điện thoại *
                    </span>
                  }
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    className={
                      isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-700"}
                    >
                      Nhóm máu *
                    </span>
                  }
                  name="bloodType"
                  rules={[
                    { required: true, message: "Vui lòng chọn nhóm máu" },
                  ]}
                >
                  <Select
                    placeholder="Chọn nhóm máu"
                    options={bloodGroups}
                    className={isDarkMode ? "dark-select" : ""}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label={
                <span className={isDarkMode ? "text-white" : "text-gray-700"}>
                  Địa chỉ *
                </span>
              }
              name="address"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ" },
                { min: 10, message: "Địa chỉ phải có ít nhất 10 ký tự" },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập địa chỉ chi tiết"
                autoSize={{ minRows: 2, maxRows: 4 }}
                className={
                  isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""
                }
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Bạn phải đồng ý với điều khoản!")
                        ),
                },
              ]}
            >
              <Checkbox className={isDarkMode ? "text-white" : ""}>
                Tôi đồng ý với{" "}
                <AntdLink href="#" style={{ color: "#d32f2f" }}>
                  điều khoản sử dụng
                </AntdLink>{" "}
                và{" "}
                <AntdLink href="#" style={{ color: "#d32f2f" }}>
                  chính sách bảo mật
                </AntdLink>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
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
                {isLoading ? "Đang xử lý..." : "Đăng Ký"}
              </Button>
              <Button
                style={{
                  width: "100%",
                  borderColor: isDarkMode ? "#4a5568" : "#ccc",
                  backgroundColor: isDarkMode ? "#2d3748" : "white",
                  color: isDarkMode ? "white" : "black",
                  fontWeight: 500,
                  fontSize: 18,
                  height: 48,
                  marginBottom: 16,
                }}
                onClick={() => {
                  form.resetFields();
                  navigate("/login");
                }}
                disabled={isLoading}
              >
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </div>

        <p
          className={`mt-6 text-center text-sm ${
            isDarkMode ? "text-white" : "text-gray-500"
          }`}
        >
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            style={{ color: "red", textDecoration: "none" }}
            className="font-medium text-red-300 hover:text-red-500"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4"
          alt="Blood Donation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 opacity-[0.5] bg-red-600 bg-opacity-40 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-white">
              "Register today and become a lifesaver. Every drop counts."
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dark-select .ant-select-selector {
          background-color: #2d3748 !important;
          border-color: #4a5568 !important;
          color: white !important;
        }
        .dark-select .ant-select-selection-placeholder {
          color: #a0aec0 !important;
        }
        .dark-select .ant-select-arrow {
          color: #a0aec0 !important;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
