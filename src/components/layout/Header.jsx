// import React, { useState, useEffect } from "react";
// import { FaHeart, FaBars, FaTimes, FaBell } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Dropdown, Menu, Avatar } from "antd";
// import { useSelector, useDispatch } from "react-redux";
// import { UserOutlined } from "@ant-design/icons";
// import { logout } from "../../redux/features/userSlice";
// import { toast } from "react-toastify";
// import api from "../../config/api";
// import DonationModal from "./DonationModal";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
//   const location = useLocation();
//   const [showDonationForm, setShowDonationForm] = useState(false);

//   const handleOpenDonationForm = () => setShowDonationForm(true);
//   const handleCloseDonationForm = () => setShowDonationForm(false);

//   // Fetch notifications and unread count
//   const fetchNotifications = async () => {
//     if (!user?.id) return;
//     setIsLoading(true);
//     try {
//       const response = await api.get("/notifications");
//       setNotifications(response.data || []);
//       console.log("Fetched notifications:", response.data); // Log để kiểm tra
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       toast.error("Không thể tải danh sách thông báo");
//       setNotifications([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchUnreadCount = async () => {
//     if (!user?.id) return;
//     try {
//       const response = await api.get("/notifications/unread-count");
//       setNotificationCount(response.data?.count || 0);
//     } catch (error) {
//       console.error("Error fetching unread count:", error);
//       toast.error("Không thể tải số thông báo chưa đọc");
//       setNotificationCount(0);
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     if (user?.id) {
//       fetchNotifications();
//       fetchUnreadCount();
//     } else {
//       setNotifications([]);
//       setNotificationCount(0);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!user?.id) return;
//     const interval = setInterval(() => {
//       fetchNotifications();
//       fetchUnreadCount();
//     }, 30000);
//     return () => clearInterval(interval);
//   }, [user]);

//   const markNotificationAsRead = async (id) => {
//     try {
//       await api.put(`/notifications/${id}/mark-read`);
//       await Promise.all([fetchNotifications(), fetchUnreadCount()]);
//       toast.success("Đã đánh dấu thông báo là đã đọc");
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//       toast.error("Không thể đánh dấu thông báo là đã đọc");
//     }
//   };

//   const deleteNotification = async (id) => {
//     try {
//       await api.delete(`/notifications/${id}`);
//       await Promise.all([fetchNotifications(), fetchUnreadCount()]);
//       toast.success("Đã xóa thông báo");
//     } catch (error) {
//       console.error("Error deleting notification:", error);
//       toast.error("Không thể xóa thông báo");
//     }
//   };

//   const markAllNotificationsAsRead = async () => {
//     try {
//       await api.put("/notifications/mark-all-read");
//       await Promise.all([fetchNotifications(), fetchUnreadCount()]);
//       toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
//     } catch (error) {
//       console.error("Error marking all notifications as read:", error);
//       toast.error("Không thể đánh dấu tất cả thông báo");
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   const notificationMenu = (
//     <Menu style={{ width: 320, maxHeight: 400, overflowY: "auto" }}>
//       {isLoading ? (
//         <Menu.Item key="loading" style={{ padding: "12px 16px" }}>
//           <div className="text-gray-600">Đang tải thông báo...</div>
//         </Menu.Item>
//       ) : notifications.length === 0 ? (
//         <Menu.Item key="empty" style={{ padding: "12px 16px" }}>
//           <div className="text-gray-600">Chưa có thông báo nào.</div>
//         </Menu.Item>
//       ) : (
//         notifications.map((notif) => (
//           <Menu.Item
//             key={notif.id}
//             style={{ borderBottom: "1px solid #f0f0f0", padding: "12px 16px" }}
//           >
//             <div className="flex items-start space-x-3">
//               <div
//                 className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
//                   notif.read ? "bg-gray-400" : "bg-red-500"
//                 }`}
//               ></div>
//               <div className="flex-1">
//                 <div className="text-sm font-medium text-gray-900">
//                   {notif.title || "Thông báo"}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {notif.message || "Không có nội dung"}
//                 </div>
//                 <div className="text-xs text-gray-400 mt-1">
//                   {new Date(notif.createdAt).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}{" "}
//                   {new Date(notif.createdAt).toLocaleDateString()}
//                 </div>
//                 <div className="flex space-x-2 mt-2">
//                   {!notif.read && (
//                     <button
//                       onClick={() => markNotificationAsRead(notif.id)}
//                       className="text-xs text-blue-500 hover:text-blue-700"
//                     >
//                       Đánh dấu đã đọc
//                     </button>
//                   )}
//                   <button
//                     onClick={() => deleteNotification(notif.id)}
//                     className="text-xs text-red-500 hover:text-red-700"
//                   >
//                     Xóa
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </Menu.Item>
//         ))
//       )}
//       <Menu.Divider />
//       <Menu.Item
//         key="all"
//         style={{ textAlign: "center", color: "#1890ff" }}
//         onClick={markAllNotificationsAsRead}
//       >
//         Đánh dấu tất cả đã đọc
//       </Menu.Item>
//       <Menu.Item
//         key="view-all"
//         style={{ textAlign: "center", color: "#1890ff" }}
//       >
//         <Link to="/notifications">Xem tất cả thông báo</Link>
//       </Menu.Item>
//     </Menu>
//   );

//   const userMenu = (
//     <Menu>
//       {user?.role === "MEMBER" && (
//         <Menu.Item key="member">
//           <Link to="/user">Trang Cá Nhân</Link>
//         </Menu.Item>
//       )}
//       {user?.role === "STAFF" && (
//         <Menu.Item key="staff">
//           <Link to="/doctor">Trang Bác Sĩ</Link>
//         </Menu.Item>
//       )}
//       {user?.role === "ADMIN" && (
//         <Menu.Item key="admin">
//           <Link to="/admin">Trang Admin</Link>
//         </Menu.Item>
//       )}
//       <Menu.Item key="logout" onClick={handleLogout}>
//         Đăng xuất
//       </Menu.Item>
//     </Menu>
//   );

//   const navItems = [
//     { name: "Tài liệu về máu", href: "#document-blood" },
//     { name: "Hiến máu", href: "#home" },
//     { name: "Tìm điểm hiến máu", href: "#donation-centers" },
//     { name: "Đánh Giá", href: "#blog-customer" },
//     { name: "Nhận Máu", href: "/blood-request" }, // Fixed: Added leading slash
//   ];

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser && !user) {
//       dispatch({ type: "user/setUser", payload: storedUser });
//     }
//   }, [dispatch, user]);

//   const handleScrollToSection = (id) => {
//     const section = document.getElementById(id);
//     if (section) {
//       section.scrollIntoView({ behavior: "smooth" });
//     }
//     setIsOpen(false);
//   };

//   return (
//     <header
//       className={`fixed w-full z-50 transition-all duration-300 ${
//         isScrolled ? "bg-red-700 shadow-lg" : "bg-red-600"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           <div className="flex-shrink-0 flex items-center">
//             <Link
//               to="/"
//               style={{ textDecoration: "none" }}
//               className="flex items-center no-underline group"
//             >
//               <img
//                 src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
//                 alt="Logo"
//                 className="h-8 w-8 rounded-full transform transition-transform group-hover:scale-110"
//               />
//               <span className="ml-2 text-2xl font-bold text-white no-underline group-hover:text-red-200 transition-colors duration-300">
//                 Dòng Máu Việt
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex space-x-8">
//             {navItems.map((item) => {
//               let handleClick;

//               if (item.name === "Hiến máu") {
//                 handleClick = handleOpenDonationForm;
//               } else if (item.href.startsWith("#")) {
//                 handleClick = () => handleScrollToSection(item.href.slice(1));
//               }

//               const sharedClassName =
//                 "relative no-underline px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 hover:bg-red-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600";

//               const sharedStyle = {
//                 color: "rgb(254 252 232)",
//                 textDecoration: "none",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 lineHeight: "1.25rem",
//                 display: "inline-block",
//               };

//               return item.href.startsWith("#") || item.name === "Hiến máu" ? (
//                 <button
//                   key={item.name}
//                   onClick={handleClick}
//                   className={sharedClassName}
//                   style={sharedStyle}
//                 >
//                   {item.name}
//                 </button>
//               ) : (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={sharedClassName}
//                   style={sharedStyle}
//                   aria-label={item.name}
//                 >
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* User Profile, Notification and Login Button */}
//           <div className="flex items-center space-x-4">
//             {user && (
//               <Dropdown
//                 overlay={notificationMenu}
//                 placement="bottomRight"
//                 trigger={["click"]}
//               >
//                 <div className="relative cursor-pointer group">
//                   <div className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:bg-red-500">
//                     <FaBell className="text-white text-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse" />
//                   </div>
//                   {notificationCount > 0 && (
//                     <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
//                       <span className="text-xs font-bold text-red-600">
//                         {notificationCount > 9 ? "9+" : notificationCount}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </Dropdown>
//             )}

//             {user ? (
//               <Dropdown overlay={userMenu} placement="bottomRight">
//                 <div className="cursor-pointer flex items-center gap-2 group">
//                   {user.profileImage ? (
//                     <img
//                       src={user.profileImage}
//                       alt={user.fullName || "User"}
//                       className="h-10 w-10 rounded-full object-cover border-2 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:border-red-200 shadow-lg hover:shadow-xl"
//                     />
//                   ) : (
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center border-2 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:border-red-200 group-hover:bg-red-500 shadow-lg hover:shadow-xl">
//                         <span className="text-white text-lg font-medium">
//                           {user?.fullName
//                             ? user.fullName.charAt(0).toUpperCase()
//                             : "U"}
//                         </span>
//                       </div>
//                       <span className="ml-2 text-white font-medium hidden md:block transition-colors duration-300 group-hover:text-red-200">
//                         {user.fullName || "User"}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </Dropdown>
//             ) : (
//               location.pathname !== "/login" && (
//                 <Link
//                   to="/login"
//                   className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-bold text-white rounded-full shadow-2xl group"
//                 >
//                   <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-pink-600 via-purple-700 to-blue-400 group-hover:opacity-100"></span>
//                   <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
//                   <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
//                   <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
//                   <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
//                   <span className="absolute inset-0 w-full h-full border border-white opacity-10 rounded-full"></span>
//                   <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
//                   <span className="relative">Đăng Nhập</span>
//                 </Link>
//               )
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-white hover:text-red-100 focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-95"
//               aria-label="Toggle menu"
//             >
//               {isOpen ? (
//                 <FaTimes className="h-6 w-6" />
//               ) : (
//                 <FaBars className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden transition-all duration-300 ease-in-out">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               {navItems.map((item) => {
//                 const handleClick = item.href.startsWith("#")
//                   ? () => handleScrollToSection(item.href.slice(1))
//                   : undefined;
//                 return item.href.startsWith("#") ? (
//                   <button
//                     key={item.name}
//                     onClick={handleClick}
//                     className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 hover:bg-red-500 hover:pl-6"
//                   >
//                     {item.name}
//                   </button>
//                 ) : (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-red-500 hover:pl-6"
//                     aria-label={item.name}
//                   >
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//       <DonationModal
//         show={showDonationForm}
//         onClose={handleCloseDonationForm}
//         userData={user}
//       />
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect } from "react";
import { FaHeart, FaBars, FaTimes, FaBell } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import api from "../../config/api";
import DonationModal from "./DonationModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const [showDonationForm, setShowDonationForm] = useState(false);

  const handleDonateClick = () => {
    if (!user || !user.id) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      toast.error("Vui lòng đăng nhập để đăng ký hiến máu!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    } else {
      setShowDonationForm(true);
    }
  };

  const handleCloseDonationForm = () => setShowDonationForm(false);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách thông báo");
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get("/notifications/unread-count");
      setNotificationCount(response.data?.count || 0);
    } catch (error) {
      toast.error("Không thể tải số thông báo chưa đọc");
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setNotificationCount(0);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markNotificationAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/mark-read`);
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      toast.success("Đã đánh dấu thông báo là đã đọc");
    } catch (error) {
      toast.error("Không thể đánh dấu thông báo là đã đọc");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      toast.success("Đã xóa thông báo");
    } catch (error) {
      toast.error("Không thể xóa thông báo");
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch (error) {
      toast.error("Không thể đánh dấu tất cả thông báo");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const userMenu = (
    <Menu>
      {user?.role === "MEMBER" && (
        <Menu.Item key="member">
          <Link to="/user">Trang Cá Nhân</Link>
        </Menu.Item>
      )}
      {user?.role === "STAFF" && (
        <Menu.Item key="staff">
          <Link to="/doctor">Trang Bác Sĩ</Link>
        </Menu.Item>
      )}
      {user?.role === "ADMIN" && (
        <Menu.Item key="admin">
          <Link to="/admin">Trang Admin</Link>
        </Menu.Item>
      )}
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const navItems = [
    { name: "Tài liệu về máu", href: "#document-blood" },
    { name: "Hiến máu", href: "#home" },
    { name: "Tìm điểm hiến máu", href: "#donation-centers" },
    { name: "Đánh Giá", href: "#blog-customer" },
    { name: "Nhận Máu", href: "/blood-request" },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && !user) {
      dispatch({ type: "user/setUser", payload: storedUser });
    }
  }, [dispatch, user]);

  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-red-700 shadow-lg" : "bg-red-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" style={{ textDecoration: "none" }} className="flex items-center no-underline group">
              <img
                src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
                alt="Logo"
                className="h-8 w-8 rounded-full transform transition-transform group-hover:scale-110"
              />
              <span
                className="ml-2 text-2xl font-bold text-white group-hover:text-red-200 transition-colors duration-300"
                
              >
                Dòng Máu Việt
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              let handleClick;

              if (item.name === "Hiến máu") {
                handleClick = handleDonateClick;
              } else if (item.href.startsWith("#")) {
                handleClick = () => handleScrollToSection(item.href.slice(1));
              }

              const sharedClassName =
                "relative no-underline px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 hover:bg-red-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600";

              const sharedStyle = {
                color: "rgb(254 252 232)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "1.25rem",
                display: "inline-block",
              };

              return item.href.startsWith("#") || item.name === "Hiến máu" ? (
                <button
                  key={item.name}
                  onClick={handleClick}
                  className={sharedClassName}
                  style={sharedStyle}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={sharedClassName}
                  style={sharedStyle}
                  aria-label={item.name}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <Dropdown
                overlay={
                  <Menu
                    style={{ width: 320, maxHeight: 400, overflowY: "auto" }}
                  >
                    {isLoading ? (
                      <Menu.Item key="loading">Đang tải thông báo...</Menu.Item>
                    ) : notifications.length === 0 ? (
                      <Menu.Item key="empty">Chưa có thông báo nào.</Menu.Item>
                    ) : (
                      notifications.map((notif) => (
                        <Menu.Item key={notif.id}>
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notif.read ? "bg-gray-400" : "bg-red-500"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {notif.title || "Thông báo"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {notif.message || "Không có nội dung"}
                              </div>
                              <div className="flex space-x-2 mt-2 text-xs">
                                {!notif.read && (
                                  <button
                                    onClick={() =>
                                      markNotificationAsRead(notif.id)
                                    }
                                    className="text-blue-500"
                                  >
                                    Đánh dấu đã đọc  |
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notif.id)}
                                  className="text-red-500"
                                >
                                  | Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </Menu.Item>
                      ))
                    )}
                    <Menu.Divider />
                    <Menu.Item onClick={markAllNotificationsAsRead}>
                      Đánh dấu tất cả đã đọc
                    </Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <div className="relative cursor-pointer group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-500">
                    <FaBell className="text-white text-lg" />
                  </div>
                  {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    </div>
                  )}
                </div>
              </Dropdown>
            )}

            {user ? (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div className="cursor-pointer flex items-center gap-2 group">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName || "User"}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white group-hover:scale-110 group-hover:border-red-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center border-2 border-white group-hover:scale-110">
                      <span className="text-white text-lg font-medium">
                        {user?.fullName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <span className="ml-2 text-white font-medium hidden md:block group-hover:text-red-200">
                    {user.fullName || "User"}
                  </span>
                </div>
              </Dropdown>
            ) : (
              location.pathname !== "/login" && (
                <Link
                  to="/login"
                  className="text-white font-semibold hover:text-yellow-100"
                >
                  Đăng Nhập
                </Link>
              )
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-100"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const handleClick =
                  item.name === "Hiến máu"
                    ? handleDonateClick
                    : item.href.startsWith("#")
                    ? () => handleScrollToSection(item.href.slice(1))
                    : null;
                return item.href.startsWith("#") || item.name === "Hiến máu" ? (
                  <button
                    key={item.name}
                    onClick={handleClick}
                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-red-500"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-500"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <DonationModal
        show={showDonationForm}
        onClose={handleCloseDonationForm}
        userData={user}
      />
    </header>
  );
};

export default Header;
