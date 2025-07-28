import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendar,
  FaHistory,
  FaClock,
  FaBell,
  FaBlog,
} from "react-icons/fa";
import ProfileComponent from "./ProfileComponent";
import HistoryComponent from "./HistoryComponent";
import AppointmentsComponent from "./AppointmentsComponent";
import InvitationsComponent from "./InvitationsComponent";
import RemindersComponent from "./RemindersComponent";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import BlogComponent from "./BlogComponent";

const DonateUser = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user) || {};

  // Banner giữ nguyên thiết kế ấn tượng ban đầu
  const renderBanner = () => (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1450&q=80"
        alt="Hiến máu cứu người"
        className="w-full h-56 object-cover brightness-75"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
        <h1 className="text-4xl font-extrabold drop-shadow-lg mb-2 animate-fadeInDown">
          Hiến máu – Kết nối sự sống
        </h1>
        <p className="text-xl font-medium drop-shadow-md">
          Một giọt máu cho đi, một cuộc đời ở lại 💖
        </p>
      </div>
    </div>
  );

  const tabsConfig = [
    { key: "profile", label: "Hồ Sơ", icon: FaUser },
    { key: "history", label: "Lịch Sử", icon: FaHistory },
    { key: "appointments", label: "Lịch Hẹn", icon: FaCalendar },
    { key: "invitations", label: "Lời Mời", icon: FaBell },
    { key: "reminders", label: "Nhắc Nhở", icon: FaClock },
    { key: "blog", label: "Blog", icon: FaBlog },
  ];

  const handleLogout = async () => {
    // Thêm nút logout nếu cần. Hiện tại chưa có trong UI này.
    await dispatch(logout());
    navigate("/");
  };
  
  // Trạng thái loading, có thể cải tiến với spinner nếu muốn
  if (!userData || Object.keys(userData).length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải dữ liệu người dùng...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {renderBanner()}
        
        {/* === Navigation Tabs - PHIÊN BẢN NÂNG CẤP === */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {tabsConfig.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex flex-col items-center justify-center space-y-2 p-4 rounded-xl 
                  font-medium text-center
                  transition-all duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                  ${
                    isActive
                      ? "bg-gradient-to-br from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/30 transform -translate-y-1"
                      : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:text-red-600 hover:-translate-y-1"
                  }
                `}
              >
                <IconComponent className="text-2xl" />
                <span className="text-sm leading-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          {activeTab === "profile" && <ProfileComponent />}
          {activeTab === "history" && <HistoryComponent />}
          {activeTab === "appointments" && <AppointmentsComponent />}
          {activeTab === "invitations" && <InvitationsComponent />}
          {activeTab === "reminders" && <RemindersComponent />}
          {activeTab === "blog" && <BlogComponent />}
        </div>
      </div>
    </div>
  );
};

export default DonateUser;
