// src/page/userpage/ProfileComponent.jsx
import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaCamera,
  FaCheckCircle,
  FaFire,
  FaTint,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

const ProfileComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageStatus, setImageStatus] = useState("loaded"); // Thêm trạng thái ảnh
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user) || {};
  const [formData, setFormData] = useState(userData);

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

  const getBloodTypeLabel = (value) => {
    const group = bloodGroups.find((group) => group.value === value);
    return group ? group.label : "Chưa xác định";
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.fullName || !formData.email) {
      toast.error("Tên và email là bắt buộc!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.put("/api/update-user", {
        fullName: formData.fullName,
        phone: formData.phone || null,
        address: formData.address || null,
        gender: formData.gender || null,
        birthdate: formData.birthdate || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        lastDonation: formData.lastDonation || null,
        medicalHistory: formData.medicalHistory || null,
        emergencyName: formData.emergencyName || null,
        emergencyPhone: formData.emergencyPhone || null,
        bloodType: formData.bloodType || null,
      });

      const updatedUser = { ...userData, ...response.data };
      dispatch(login(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFormData(updatedUser);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response?.status === 404) {
        toast.error("Không tìm thấy người dùng. Vui lòng kiểm tra lại!");
      } else {
        toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Kích thước ảnh không được vượt quá 5MB!");
      return;
    }

    setIsLoading(true);
    setImageStatus("loading");
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await api.put(
        `/users/${userData.id}/profile-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updatedUser = {
        ...userData,
        profileImage: response.data.profileImage,
      };
      dispatch(login(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFormData(updatedUser);
      setImageStatus("loaded");
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error("Error uploading profile image:", err);
      setImageStatus("error");
      toast.error("Cập nhật ảnh đại diện thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      <span className="absolute top-2 right-4 animate-pulse">
        <FaFire className="text-red-400 text-3xl drop-shadow-lg" />
      </span>
      <div className="flex justify-between items-center mb-8 mt-4">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {imageStatus === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full">
                <span className="text-gray-600">Đang tải...</span>
              </div>
            )}
            {imageStatus === "error" && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100 rounded-full">
                <span className="text-red-600">Ảnh lỗi</span>
              </div>
            )}
            <img
              src={
                userData.profileImage ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe686s_Cv_FIhQ7Vn1EQaqd2ynJS91CFcptA&s"
              }
              alt="Hồ sơ"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-red-200 shadow-lg border-4 border-white"
              onError={() => setImageStatus("error")}
            />
            <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-red-200 shadow cursor-pointer hover:bg-red-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <FaCamera className="text-red-500 text-2xl" />
            </label>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {userData.fullName || "Người dùng"}
            </h2>
            <div className="flex items-center bg-gradient-to-r from-red-100 to-red-200 px-4 py-2 rounded-full">
              <FaTint className="text-red-600 mr-2 animate-pulse" />
              <span className="text-xl font-semibold text-red-600">
                {getBloodTypeLabel(userData.bloodType)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors shadow"
          disabled={isLoading}
          title="Chỉnh sửa hồ sơ"
        >
          <FaEdit className="text-red-600 text-xl" />
        </button>
      </div>
      {!isEditing ? (
        <div className="space-y-4 mb-8">
          <p className="text-gray-600">
            <strong>Tên:</strong> {userData.fullName || "Chưa có thông tin"}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {userData.email || "Chưa có thông tin"}
          </p>
          <p className="text-gray-600">
            <strong>Điện thoại:</strong> {userData.phone || "Chưa có thông tin"}
          </p>
          <p className="text-gray-600">
            <strong>Địa chỉ:</strong> {userData.address || "Chưa có thông tin"}
          </p>
          <p className="text-gray-600">
            <strong>Nhóm máu:</strong> {getBloodTypeLabel(userData.bloodType)}
          </p>
        </div>
      ) : (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Tên</label>
              <input
                type="text"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Điện thoại</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Địa chỉ</label>
              <textarea
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Nhóm máu</label>
              <select
                value={formData.bloodType || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bloodType: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
                disabled={isLoading}
              >
                <option value="">Chưa xác định</option>
                {bloodGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-red-400"
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData(userData);
              }}
              className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 disabled:border-red-400 disabled:text-red-400"
              disabled={isLoading}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm">
        <div className="flex items-center">
          <FaCheckCircle className="text-red-500 text-xl mr-3" />
          <span className="text-red-700 font-semibold text-lg">
            {userData.isEligible
              ? "Đủ điều kiện cho lần hiến tiếp theo"
              : "Chưa đủ điều kiện hiến máu"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
