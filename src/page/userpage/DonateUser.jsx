import React, { useState, useEffect } from "react";
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
import api from "../../config/api";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import BlogComponent from "./BlogComponent";

const DonateUser = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user) || {};

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

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  if (!userData || Object.keys(userData).length === 0) {
    return <div className="text-center py-8">Đang chuyển hướng...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {renderBanner()}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            "profile",
            "history",
            "appointments",
            "invitations",
            "reminders",
            "blog",
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
              {tab === "invitations" && <FaBell />}
              {tab === "reminders" && <FaClock />}
              {tab === "blog" && <FaBlog />}
              <span className="capitalize">
                {tab === "profile"
                  ? "Hồ sơ"
                  : tab === "history"
                  ? "Lịch sử"
                  : tab === "appointments"
                  ? "Lịch hẹn"
                  : tab === "invitations"
                  ? "Lời mời"
                  : tab === "reminders"
                  ? "Nhắc nhở"
                  : "Blog"}
              </span>
            </button>
          ))}
        </div>
        <div className="transition-all duration-300">
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











// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUser,
//   FaCalendar,
//   FaHistory,
//   FaClock,
//   FaBell,
//   FaBlog,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import ProfileComponent from "./ProfileComponent";
// import HistoryComponent from "./HistoryComponent";
// import AppointmentsComponent from "./AppointmentsComponent";
// import InvitationsComponent from "./InvitationsComponent";
// import RemindersComponent from "./RemindersComponent";
// import BlogComponent from "./BlogComponent";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../redux/features/userSlice";

// // Cấu trúc dữ liệu cho các tab để dễ quản lý và render
// const TABS = [
//   { id: "profile", label: "Hồ sơ", icon: FaUser, component: ProfileComponent },
//   { id: "history", label: "Lịch sử", icon: FaHistory, component: HistoryComponent },
//   { id: "appointments", label: "Lịch hẹn", icon: FaCalendar, component: AppointmentsComponent },
//   { id: "invitations", label: "Lời mời", icon: FaBell, component: InvitationsComponent },
//   { id: "reminders", label: "Nhắc nhở", icon: FaClock, component: RemindersComponent },
//   { id: "blog", label: "Blog", icon: FaBlog, component: BlogComponent },
// ];

// const DonateUser = () => {
//   const [activeTab, setActiveTab] = useState("profile");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.user);

//   const handleLogout = async () => {
//     await dispatch(logout());
//     navigate("/");
//   };

//   if (!userData || Object.keys(userData).length === 0) {
//     return <div className="flex justify-center items-center h-screen bg-gray-100">Đang tải dữ liệu...</div>;
//   }
  
//   const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || ProfileComponent;

//   const renderSidebar = () => (
//     <aside className="w-72 bg-white flex flex-col shadow-lg">
//       {/* PHẦN THÔNG TIN NGƯỜI DÙNG ĐÃ ĐƯỢC LOẠI BỎ */}

//       {/* Navigation Section */}
//       <nav className="flex-grow p-4 pt-6"> {/* Thêm padding-top để menu không quá sát lề trên */}
//         <ul className="space-y-2">
//           {TABS.map((tab) => (
//             <li key={tab.id}>
//               <button
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
//                   activeTab === tab.id
//                     ? "bg-red-500 text-white shadow-md"
//                     : "text-gray-600 hover:bg-red-50 hover:text-red-600"
//                 }`}
//               >
//                 <tab.icon className="text-xl" />
//                 <span className="font-medium">{tab.label}</span>
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Logout Section */}
//       <div className="p-4 border-t border-gray-200">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-500 transition-colors duration-200"
//         >
//           <FaSignOutAlt className="text-xl" />
//           <span className="font-medium">Đăng xuất</span>
//         </button>
//       </div>
//     </aside>
//   );

//   const renderBanner = () => (
//     <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
//       <img
//         src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1450&q=80"
//         alt="Hiến máu cứu người"
//         className="w-full h-56 object-cover brightness-75"
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end items-start p-8 text-white">
//         <h1 className="text-4xl font-extrabold drop-shadow-lg mb-2">
//           Hiến máu – Kết nối sự sống
//         </h1>
//         <p className="text-xl font-light drop-shadow-md">
//           Một giọt máu cho đi, một cuộc đời ở lại 💖
//         </p>
//       </div>
//     </div>
//   );
  
//   return (
//     <div className="flex h-screen bg-gray-50 font-sans">
//       {renderSidebar()}
      
//       <main className="flex-1 p-8 overflow-y-auto">
//         {renderBanner()}
        
//         <div key={activeTab} className="bg-white p-6 rounded-xl shadow-md animate-fadeIn">
//           <ActiveComponent />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DonateUser;