import React, { useState, useEffect } from "react";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Menu, Avatar } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { logout } from "../../redux/features/userSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/user">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const navItems = [
    { name: "Tài liệu về máu", href: "#document-blood" },
    { name: "Hiến máu", href: "#home" }, // Đổi từ #donation-process thành #home
    { name: "Tìm điểm hiến máu", href: "#donation-centers" },
    { name: "Đánh Giá", href: "#blog-customer" },
    { name: "Nhận Máu", href: "blood-request" }
  ];

  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-red-700 shadow-lg" : "bg-red-600"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              style={{textDecoration: 'none'}} 
              className="flex items-center no-underline group"
            >
              <img
                src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
                alt="Logo"
                className="h-8 w-8 rounded-full transform transition-transform group-hover:scale-110"
              />
              <span className="ml-2 text-2xl font-bold text-white no-underline group-hover:text-red-200 transition-colors duration-300">
                Dòng Máu Việt
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Hiển thị luôn */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) =>
              item.name === "Hiến máu" ? (
                <button
                  key={item.name}
                  onClick={() => handleScrollToSection("home")} // Đổi từ "donation-process" thành "home"
                  className="relative no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 hover:bg-red-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600"
                >
                  {item.name}
                </button>
              ) : item.name === "Tài liệu về máu" ? (
                <button
                  key={item.name}
                  onClick={() => handleScrollToSection("document-blood")}
                  className="relative no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 hover:bg-red-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600"
                >
                  {item.name}
                </button>
              ) : item.name === "Tìm điểm hiến máu" ? (
                <button
                  key={item.name}
                  onClick={() => handleScrollToSection("donation-centers")}
                  className="relative no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 hover:bg-red-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600"
                >
                  {item.name}
                </button>
              ) : item.name === "Đánh Giá" ? (
                <button
                  key={item.name}
                  onClick={() => handleScrollToSection("blog-customer")}
                  className="relative no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 hover:bg-red-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{ color: "white", textDecoration: "none" }}
                  className="relative no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 hover:bg-red-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600"
                  aria-label={item.name}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* User Profile or Login Button */}
          <div className="flex items-center">
            {user ? (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div className="cursor-pointer flex items-center gap-2 group">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName || "User"}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:border-red-200 shadow-lg hover:shadow-xl"
                    />
                  ) : (
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center border-2 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:border-red-200 group-hover:bg-red-500 shadow-lg hover:shadow-xl">
                        <span className="text-white text-lg font-medium">
                          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                      <span className="ml-2 text-white font-medium hidden md:block transition-colors duration-300 group-hover:text-red-200">
                        {user.fullName || "User"}
                      </span>
                    </div>
                  )}
                </div>
              </Dropdown>
            ) : location.pathname !== "/login" && (
              <Link
                to="/login"
                className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-bold text-white rounded-full shadow-2xl group"
              >
                <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-pink-600 via-purple-700 to-blue-400 group-hover:opacity-100"></span>
                <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
                <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
                <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>
                <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
                <span className="absolute inset-0 w-full h-full border border-white opacity-10 rounded-full"></span>
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
                <span className="relative">Đăng Nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-100 focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Hiển thị luôn */}
        {isOpen && (
          <div className="md:hidden transition-all duration-300 ease-in-out">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) =>
                item.name === "Hiến máu" ? (
                  <button
                    key={item.name}
                    onClick={() => handleScrollToSection("home")} // Đổi từ "donation-process" thành "home"
                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 hover:bg-red-500 hover:pl-6"
                  >
                    {item.name}
                  </button>
                ) : item.name === "Tài liệu về máu" ? (
                  <button
                    key={item.name}
                    onClick={() => handleScrollToSection("document-blood")}
                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 hover:bg-red-500 hover:pl-6"
                  >
                    {item.name}
                  </button>
                ) : item.name === "Tìm điểm hiến máu" ? (
                  <button
                    key={item.name}
                    onClick={() => handleScrollToSection("donation-centers")}
                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 hover:bg-red-500 hover:pl-6"
                  >
                    {item.name}
                  </button>
                ) : item.name === "Đánh Giá" ? (
                  <button
                    key={item.name}
                    onClick={() => handleScrollToSection("blog-customer")}
                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 hover:bg-red-500 hover:pl-6"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-red-500 hover:pl-6"
                    aria-label={item.name}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;