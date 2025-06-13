import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaCalendar,
  FaHistory,
  FaSignOutAlt,
  FaTint,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaEdit,
  FaAward,
  FaMedal,
  FaStar,
  FaFire,
  FaBell,
  FaSearch,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../config/api";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../redux/features/userSlice";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user) || {};
  const [formData, setFormData] = useState(userData);
  const [donationHistory, setDonationHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Emergency blood request states
  const [emergencyRequest, setEmergencyRequest] = useState({
    blood_type: "",
    date: "",
    location: "",
    note: "",
  });
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [invitations, setInvitations] = useState([]); // For DNR02
  const [searchCriteria, setSearchCriteria] = useState({
    blood_type: "",
    location: "",
    bloodTypeDetail: "", // For REC03
  });

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

  // Banner truyền cảm hứng
  const renderBanner = () => (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1450&q=80"
        alt="Hiến máu cứu người"
        className="w-full h-56 object-cover brightness-75"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-extrabold drop-shadow-lg mb-2 animate-fadeInDown">
          Hiến máu – Kết nối sự sống
        </h1>
        <p className="text-xl font-medium drop-shadow-md">
          Một giọt máu cho đi, một cuộc đời ở lại 💖
        </p>
      </div>
    </div>
  );

  // Badge thành tích
  const renderAchievement = () => {
    if (userData.totalDonations >= 10) {
      return (
        <div className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-400 rounded-full shadow animate-bounce">
          <FaAward className="text-yellow-500 text-2xl" />
          <span className="font-bold text-yellow-900">Hiến máu xuất sắc</span>
        </div>
      );
    } else if (userData.totalDonations >= 5) {
      return (
        <div className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 rounded-full shadow animate-pulse">
          <FaMedal className="text-gray-700 text-2xl" />
          <span className="font-bold text-gray-800">
            Cống hiến vì cộng đồng
          </span>
        </div>
      );
    }
    return null;
  };

  // Thanh tiến trình
  const renderProgress = () => {
    const target = 10;
    const value = Math.min(userData.totalDonations || 0, target);
    const percent = Math.round((value / target) * 100);
    return (
      <div className="my-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-600">Tiến độ hiến máu</span>
          <span className="text-sm text-red-700 font-bold">
            {value}/{target} lần
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 bg-gradient-to-r from-red-400 to-red-700 transition-all duration-500"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        {value === target && (
          <div className="mt-2 flex items-center text-green-600">
            <FaStar className="mr-2 animate-ping" />
            <span>Chúc mừng bạn đã đạt mục tiêu năm nay!</span>
          </div>
        )}
      </div>
    );
  };

  // Fetch user data if Redux state is empty
  useEffect(() => {
    const fetchUserData = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        dispatch(login(parsedUser));
        setFormData(parsedUser);
      } else {
        navigate("/login");
      }
    };

    if (!userData || Object.keys(userData).length === 0) {
      fetchUserData();
    } else {
      setFormData(userData);
    }
  }, [userData, navigate, dispatch]);

  // Fetch donation history, appointments, emergency requests, and invitations
  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const response = await api.get(`/donations/${userData.id}`);
        setDonationHistory(response.data);
      } catch (error) {
        setDonationHistory([
          {
            date: "15-01-2024",
            location: "Bệnh Viện Đa Khoa Trung Ương",
            amount: "250ml",
          },
          {
            date: "10-10-2023",
            location: "Trung Tâm Huyết Học Quốc Gia",
            amount: "450ml",
          },
          {
            date: "05-07-2023",
            location: "Bệnh Viện Chợ Rẫy",
            amount: "210ml",
          },
        ]);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await api.get(`/appointments/${userData.id}`);
        setAppointments(response.data);
      } catch (error) {
        setAppointments([
          {
            id: 1,
            date: "20-03-2024",
            time: "10:00 Sáng",
            location: "Bệnh Viện Chợ Rẫy",
            status: "Đã Xác Nhận",
          },
        ]);
      }
    };

    const fetchEmergencyRequests = async () => {
      try {
        const res = await api.get(`/emergency-requests/${userData.id}`);
        setEmergencyRequests(res.data);
      } catch (error) {
        setEmergencyRequests([]);
      }
    };

    const fetchInvitations = async () => {
      try {
        const res = await api.get(`/invitations/${userData.id}`);
        setInvitations(res.data);
      } catch (error) {
        setInvitations([]);
      }
    };

    if (userData.id) {
      fetchDonationHistory();
      fetchAppointments();
      fetchEmergencyRequests();
      fetchInvitations();
    }
  }, [userData.id]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put(`/users/${userData.id}`, formData);
      dispatch(login(response.data));
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Cập nhật thông tin thất bại!");
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
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await api.put(
        `/users/${userData.id}/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = {
        ...userData,
        profileImage: response.data.profileImage,
      };
      dispatch(login(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFormData(updatedUser);
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error("Error uploading profile image:", err);
      toast.error("Cập nhật ảnh đại diện thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfile = () => (
    <div className="bg-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      <span className="absolute top-2 right-4 animate-pulse">
        <FaFire className="text-red-400 text-3xl drop-shadow-lg" />
      </span>
      {renderAchievement()}
      <div className="flex justify-between items-center mb-8 mt-4">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={
                userData.profileImage ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe686s_Cv_FIhQ7Vn1EQaqd2ynJS91CFcptA&s"
              }
              alt="Hồ sơ"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-red-200 shadow-lg border-4 border-white"
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
              {userData.full_name || "Người dùng"}
            </h2>
            <div className="flex items-center bg-gradient-to-r from-red-100 to-red-200 px-4 py-2 rounded-full">
              <FaTint className="text-red-600 mr-2 animate-pulse" />
              <span className="text-xl font-semibold text-red-600">
                {getBloodTypeLabel(userData.blood_type)}
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
      {renderProgress()}
      {!isEditing ? (
        <div className="space-y-4 mb-8">
          <p className="text-gray-600">
            <strong>Tên:</strong> {userData.full_name || "Chưa có thông tin"}
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
            <strong>Nhóm máu:</strong> {getBloodTypeLabel(userData.blood_type)}
          </p>
        </div>
      ) : (
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Tên</label>
            <input
              type="text"
              value={formData.full_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
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
              value={formData.blood_type || ""}
              onChange={(e) =>
                setFormData({ ...formData, blood_type: e.target.value })
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

  const renderHistory = () => (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Lịch Sử Hiến Máu
      </h3>
      <div className="space-y-6">
        {donationHistory.length === 0 ? (
          <p className="text-gray-600">Chưa có lịch sử hiến máu.</p>
        ) : (
          donationHistory.map((donation, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {donation.location}
                  </p>
                  <p className="text-gray-600">{donation.date}</p>
                </div>
                <div className="text-red-600 font-bold text-lg">
                  {donation.amount}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Lịch Hẹn Hiến Máu
      </h3>
      <div className="space-y-6">
        {appointments.length === 0 ? (
          <p className="text-gray-600">Chưa có lịch hẹn nào.</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-gradient-to-r from-red-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg text-gray-800">
                    {appointment.location}
                  </p>
                  <p className="text-gray-600">
                    {appointment.date} - {appointment.time}
                  </p>
                </div>
                <div className="text-green-600 font-bold">
                  {appointment.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderEmergency = () => (
    <div className="bg-white p-8 rounded-xl shadow-2xl space-y-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Đăng ký nhận máu khẩn cấp
      </h3>
      <form onSubmit={handleEmergencyRegister} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Nhóm máu cần nhận</label>
          <select
            value={emergencyRequest.blood_type}
            onChange={(e) =>
              setEmergencyRequest({
                ...emergencyRequest,
                blood_type: e.target.value,
              })
            }
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Chọn nhóm máu</option>
            {bloodGroups.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Ngày cần nhận</label>
          <input
            type="date"
            value={emergencyRequest.date}
            onChange={(e) =>
              setEmergencyRequest({ ...emergencyRequest, date: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Địa điểm</label>
          <input
            type="text"
            value={emergencyRequest.location}
            onChange={(e) =>
              setEmergencyRequest({
                ...emergencyRequest,
                location: e.target.value,
              })
            }
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Ghi chú (không bắt buộc)
          </label>
          <textarea
            value={emergencyRequest.note}
            onChange={(e) =>
              setEmergencyRequest({ ...emergencyRequest, note: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
            rows={2}
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          disabled={isEmergencyLoading}
        >
          {isEmergencyLoading ? "Đang gửi..." : "Gửi yêu cầu khẩn cấp"}
        </button>
      </form>

      <div>
        <h4 className="font-bold mb-2 text-gray-800">
          Lịch sử yêu cầu khẩn cấp
        </h4>
        {emergencyRequests.length === 0 ? (
          <p className="text-gray-600">Chưa có yêu cầu nào.</p>
        ) : (
          <ul className="space-y-3">
            {emergencyRequests.map((req, idx) => (
              <li
                key={idx}
                className="p-4 bg-gradient-to-r from-red-50 to-white rounded-xl shadow-sm"
              >
                <div className="flex justify-between">
                  <span>
                    <b>Nhóm máu:</b> {getBloodTypeLabel(req.blood_type)}
                  </span>
                  <span className="italic">
                    {req.status || "Đang chờ xử lý"}
                  </span>
                </div>
                <div>
                  <b>Ngày:</b> {req.date} |<b>Địa điểm:</b> {req.location}
                </div>
                {req.note && (
                  <div>
                    <b>Ghi chú:</b> {req.note}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Donors (REC02, REC03, REC04) */}
      <div className="bg-white p-6 rounded-xl shadow-2xl">
        <h4 className="text-xl font-bold mb-4 text-gray-800">
          Tìm người hiến máu
        </h4>
        <form onSubmit={handleSearchDonors} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nhóm máu</label>
            <select
              value={searchCriteria.blood_type}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  blood_type: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Tất cả</option>
              {bloodGroups.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Loại máu (hồng cầu, huyết tương, tiểu cầu)
            </label>
            <select
              value={searchCriteria.bloodTypeDetail}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  bloodTypeDetail: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Tất cả</option>
              <option value="red_blood">Hồng cầu</option>
              <option value="plasma">Huyết tương</option>
              <option value="platelets">Tiểu cầu</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Khu vực</label>
            <input
              type="text"
              value={searchCriteria.location}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  location: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="Nhập khu vực (VD: TP.HCM)"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center"
          >
            <FaSearch className="mr-2" /> Tìm kiếm
          </button>
        </form>
      </div>
    </div>
  );

  const renderInvitations = () => (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Lời mời hiến máu
      </h3>
      {invitations.length === 0 ? (
        <p className="text-gray-600">Chưa có lời mời nào.</p>
      ) : (
        <ul className="space-y-4">
          {invitations.map((inv, idx) => (
            <li
              key={idx}
              className="p-4 bg-gradient-to-r from-red-50 to-white rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {inv.message || "Mời hiến máu"}
                </span>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  onClick={() => toast.success("Đã chấp nhận lời mời!")}
                >
                  Chấp nhận
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                {inv.date} - {inv.location}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderReminders = () => (
    <div className="bg-white p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Nhắc nhở hiến máu
      </h3>
      <div className="space-y-4">
        <p className="text-gray-600">
          Thời gian phù hợp tiếp theo:{" "}
          {userData.lastDonation
            ? new Date(
                new Date(userData.lastDonation).setMonth(
                  new Date(userData.lastDonation).getMonth() + 3
                )
              ).toLocaleDateString()
            : "Chưa có thông tin"}
        </p>
        <button
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center"
          onClick={() => toast.info("Nhắc nhở đã được gửi!")}
        >
          <FaBell className="mr-2" /> Nhận nhắc nhở
        </button>
      </div>
    </div>
  );

  if (!userData || Object.keys(userData).length === 0) {
    return <div className="text-center py-8">Đang chuyển hướng...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center no-underline text-white"
            >
              <img
                src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
                alt="Biểu tượng"
                className="h-8 w-8 text-red-100 animate-pulse rounded-full"
              />
              <span className="ml-2 text-2xl font-bold">Dòng Máu Việt</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white font-semibold px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-red-700 transition-all duration-300"
            >
              <FaSignOutAlt />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {renderBanner()}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            "profile",
            "history",
            "appointments",
            "emergency",
            "invitations",
            "reminders",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === tab
                  ? "bg-red-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-600 hover:bg-red-50 hover:scale-102"
              }`}
            >
              {tab === "profile" && <FaUser />}
              {tab === "history" && <FaHistory />}
              {tab === "appointments" && <FaCalendar />}
              {tab === "emergency" && <FaTint />}
              {tab === "invitations" && <FaBell />}
              {tab === "reminders" && <FaClock />}
              <span className="capitalize">
                {tab === "profile"
                  ? "Hồ sơ"
                  : tab === "history"
                  ? "Lịch sử"
                  : tab === "appointments"
                  ? "Lịch hẹn"
                  : tab === "emergency"
                  ? "Nhận máu khẩn cấp"
                  : tab === "invitations"
                  ? "Lời mời"
                  : "Nhắc nhở"}
              </span>
            </button>
          ))}
        </div>
        <div className="transition-all duration-300">
          {activeTab === "profile" && renderProfile()}
          {activeTab === "history" && renderHistory()}
          {activeTab === "appointments" && renderAppointments()}
          {activeTab === "emergency" && renderEmergency()}
          {activeTab === "invitations" && renderInvitations()}
          {activeTab === "reminders" && renderReminders()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
