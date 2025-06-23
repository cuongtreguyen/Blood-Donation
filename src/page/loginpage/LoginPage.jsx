import { useState } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MouseFollowButton from "../../components/forms/MouseFollowButton";
import api from "../../config/api";
import { login } from "../../redux/features/userSlice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setIsLoading(true);
    console.log("Login attempt:", values);

    try {
      const response = await api.post("login", values);
      const userData = {
        ...response.data,
        id: response.data.id || response.data.userId || response.data._id,
        profileImage: response.data.avatar || null, // Sử dụng avatar từ API hoặc null nếu không có
      };

      // Đăng nhập thành công
      toast.success("Đăng Nhập Thành Công!");
      dispatch(login(userData));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Kiểm tra role và chuyển hướng
      const userRole = userData.role;
      console.log("User role detected:", userRole);

      if (userRole === "ADMIN") {
        console.log("Redirecting to admin dashboard");
        navigate("/admin");
      } else if (userRole === "STAFF" || userRole === "DOCTOR") {
        console.log("Redirecting to doctor dashboard");
        navigate("/doctor");
      } else {
        console.log("Redirecting to user dashboard");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 404) {
        toast.error("Không tìm thấy thông tin người dùng!");
      } else if (error.response?.status === 401) {
        toast.error("Email hoặc mật khẩu không đúng!");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same...
  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Left Column - Login Form */}
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
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          className="space-y-6"
        >
          <Form.Item
            label={
              <span className={isDarkMode ? "text-white" : "text-gray-700"}>
                Đăng Nhập Email
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Vui Lòng Nhập Email" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              className="dark:bg-gray-800 dark:text-white"
              placeholder="example@email.com"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className={isDarkMode ? "text-white" : "text-gray-700"}>
                Nhập Mật Khẩu
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Vui Lòng Nhập Mật Khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              className="dark:bg-gray-800 dark:text-white"
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox
                style={{ color: "red" }}
                className={isDarkMode ? "text-red-500" : "text-gray-700"}
              >
                Ghi Nhớ Cho Lần Đăng Nhập Sau
              </Checkbox>
            </Form.Item>

            <Link
              to="/verify-otp"
              style={{ color: "red", textDecoration: "none" }}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Quên Mật Khẩu?
            </Link>
          </div>

          <Form.Item>
            <Button
              style={{ backgroundColor: "red" }}
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full bg-red-200 hover:bg-red-700 text-white border-none"
            >
              Đăng Nhập
            </Button>
          </Form.Item>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${
                    isDarkMode
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {/* Có thể thêm social login buttons ở đây */}
            </div>
          </div>
        </Form>

        <p
          className={`mt-10 text-center text-sm ${
            isDarkMode ? "text-white" : "text-gray-500"
          }`}
        >
          Chưa Có Tài Khoản?{" "}
          <Link
            to="/register"
            style={{ color: "red", textDecoration: "none" }}
            className="font-medium text-red-300 hover:text-red-500"
          >
            Đăng Ký Ngay
          </Link>
          <div className="mt-4 flex justify-center">
            <MouseFollowButton />
          </div>
        </p>
      </div>

      {/* Right Column - Image */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4"
          alt="Blood Donation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 opacity-[0.5] bg-red-600 bg-opacity-40 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Chào Mừng Trở Lại!
            </h2>
            <p className="text-white text-lg">
              Cùng chung tay vì một cộng đồng khỏe mạnh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
