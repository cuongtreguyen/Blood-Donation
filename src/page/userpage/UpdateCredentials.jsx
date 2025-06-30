import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaKey, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

const UpdateCredentials = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user) || {};

  const [formData, setFormData] = useState({
    email: userData.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, currentPassword, newPassword, confirmPassword } = formData;
    const token = userData.token;

    if (!currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại để xác nhận!");
      return;
    }

    let isChangingEmail = false;
    let isChangingPassword = false;

    // Kiểm tra xem có thay đổi email không
    if (email && email !== userData.email) {
      isChangingEmail = true;
    }

    // Kiểm tra xem có thay đổi password không
    if (newPassword || confirmPassword) {
      if (!newPassword || !confirmPassword) {
        toast.error("Vui lòng nhập đầy đủ mật khẩu mới và xác nhận!");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp!");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
      }
      if (newPassword === currentPassword) {
        toast.error("Mật khẩu mới phải khác mật khẩu hiện tại!");
        return;
      }
      isChangingPassword = true;
    }

    if (!isChangingEmail && !isChangingPassword) {
      toast.info("Không có thay đổi nào để cập nhật!");
      return;
    }

    setIsLoading(true);
    try {
      // Chuẩn bị payload theo format API: chỉ email và password
      const updatePayload = {};
      
      if (isChangingEmail) {
        updatePayload.email = email;
      }
      
      if (isChangingPassword) {
        updatePayload.password = newPassword; // API nhận 'password', không phải 'newPassword'
      }

      await api.put("/user/update/email-password", updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cập nhật Redux store nếu email thay đổi
      if (isChangingEmail) {
        const updatedUser = { ...userData, email };
        dispatch(login(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success("Cập nhật thành công!");
      onClose?.();
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        toast.error("Mật khẩu hiện tại không chính xác!");
      } else if (status === 409) {
        toast.error("Email đã tồn tại!");
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <FaKey className="text-red-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Cập nhật thông tin đăng nhập
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email mới */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email mới
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Nhập email mới"
                disabled={isLoading}
              />
            </div>

            {/* Mật khẩu hiện tại */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
                  placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Nút submit */}
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Cập nhật"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                disabled={isLoading}
              >
                Hủy
              </button>
            </div>
          </form>

          {/* Ghi chú bảo mật */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <p className="font-semibold mb-1">Lưu ý bảo mật:</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Mật khẩu phải có ít nhất 6 ký tự</li>
              <li>Không chia sẻ thông tin đăng nhập với người khác</li>
              <li>Đổi mật khẩu định kỳ để đảm bảo an toàn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCredentials;
