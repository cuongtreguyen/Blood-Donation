import { useState } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import { FaGoogle, FaFacebook, FaApple, FaMoon, FaSun } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setIsLoading(true);
    console.log("Form Values:", values);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
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
            <h1 style={{color : "red"}} className={`text-2xl font-bold ${isDarkMode ? "text-red-500" : "text-gray-800"}`}>
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
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          className="space-y-6"
        >
          <Form.Item
            label={<span className={isDarkMode ? "text-white" : "text-gray-700"}>Email Address</span>}
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input className="dark:bg-gray-800 dark:text-white" />
          </Form.Item>

          <Form.Item
            label={<span className={isDarkMode ? "text-white" : "text-gray-700"}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password className="dark:bg-gray-800 dark:text-white" />
          </Form.Item>

          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{color:"red"}} className={isDarkMode ? "text-red-500" : "text-gray-700"}>Remember me</Checkbox>
            </Form.Item>
            <a href="#" style={{ color: "red", textDecoration: "none" }}
            className="text-sm font-medium text-red-600 hover:text-red-500">
              Forgot password?
            </a>
          </div>

      <Form.Item>
        <Button
          style={{ backgroundColor: "red" }}
          type="primary"
          htmlType="submit"
          loading={isLoading}
          className="w-full bg-red-200 hover:bg-red-700 text-white border-none"
        >
          Sign in
        </Button>
      </Form.Item>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-500"}`}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
            </div>
          </div>
        </Form>

        <p className={`mt-10 text-center text-sm ${isDarkMode ? "text-white" : "text-gray-500"}`}>
          Not a member?{" "}
          {/* <a href="#" className="font-medium text-red-600 hover:text-red-500">
            Register now
          </a> */}
          <Link to="/register" style={{ color: "red", textDecoration: "none" }}
          className="font-medium text-red-300 hover:text-red-500">
            Register now
          </Link>
        </p>
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

export default LoginPage;
