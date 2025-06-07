import React, { useState } from "react";
import { Mail, ArrowLeft, Loader2, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (attempts >= 3) {
      setError("Quá nhiều lần thử. Vui lòng thử lại sau.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }

    setIsLoading(true);
    setAttempts(prev => prev + 1);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-gray-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <Heart
            key={i}
            className="text-red-800 absolute animate-pulse transition-all duration-3000"
            style={{
              fontSize: `${Math.random() * 50 + 25}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl relative z-10 hover:shadow-3xl transition-all duration-300">
        <div>
          <div className="flex justify-center">
            <Heart className="h-16 w-16 text-red-800" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quên Mật Khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="rounded-full bg-green-100 p-3 mx-auto w-16 h-16 flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Kiểm tra email của bạn
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới địa chỉ email của bạn.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Nhập email đã đăng ký của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          {/* <button
            onClick={() => {}}
            className="flex items-center justify-center text-sm font-medium text-red-800 hover:text-red-900 transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </button> */}
          <Link to="/login" className="flex items-center justify-center text-sm font-medium text-red-800 hover:text-red-900 transition-colors duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vể Trang Đăng Nhập
          </Link>
        </div>

       
      </div>
    </div>
  );
};

export default ForgotPassword;




