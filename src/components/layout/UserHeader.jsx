import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const UserHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [userImage, setUserImage] = useState(user?.profileImage);

  useEffect(() => {
    if (user?.profileImage) {
      setUserImage(user.profileImage);
    }
  }, [user?.profileImage]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/user/profile">Hồ sơ</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
              alt="Logo"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-2xl font-bold text-red-600">Dòng Máu Việt</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Dropdown overlay={menu} placement="bottomRight">
              <div className="flex items-center space-x-3 cursor-pointer">
                <span className="text-gray-700 hidden md:block">
                  {user?.full_name || "Người dùng"}
                </span>
                <div className="relative">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={user.full_name || "User"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center border-2 border-white shadow-lg">
                      <span className="text-white text-lg font-medium">
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader; 