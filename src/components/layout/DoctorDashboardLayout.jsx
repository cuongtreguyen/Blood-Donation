import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "../../redux/features/userSlice";
import {
  FaTachometerAlt,
  FaUser,
  FaNotesMedical,
  FaTint,
  FaFileAlt,
  FaUserCircle,
  FaHistory, // Thêm icon cho Lịch sử
} from "react-icons/fa";

function DoctorDashboardLayout() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { to: "/doctor", label: "Tổng Quan", icon: <FaTachometerAlt /> },
    { to: "/doctor/donors", label: "Danh Sách Hiến Máu", icon: <FaUser /> },
    {
      to: "/doctor/medical-records",
      label: "Hồ Sơ Y Tế",
      icon: <FaNotesMedical />,
    },
    { to: "/doctor/blood-inventory", label: "Kho Máu", icon: <FaTint /> },
    {
      to: "/doctor/blood-receive",
      label: "Danh Sách Nhận Máu",
      icon: <FaTint />,
    },
    {
      to: "/doctor/donation-history",
      label: "Lịch sử hiến máu",
      icon: <FaHistory />,
    },
    // { to: "/doctor/reports", label: "Báo Cáo", icon: <FaFileAlt /> },
    { to: "/doctor/profile", label: "Hồ Sơ Cá Nhân", icon: <FaUserCircle /> },
  ];

  useEffect(() => {
    // Redirect if not logged in or not authorized
    if (!user || (user.role !== "DOCTOR" && user.role !== "STAFF")) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-red-600 text-white p-6">
        {/* <h1 className="text-2xl font-bold mb-8">{user?.role === "DOCTOR" ? "Bác Sĩ" : "Nhân Viên"} Dashboard</h1> */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            marginBottom: "2rem", // tương đương mb-8
          }}
        >
          <img
            src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
            alt="Logo"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          <span
            style={{
              marginLeft: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Dòng Máu Việt
          </span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded font-medium text-white transition ${
                location.pathname === item.to
                  ? "bg-red-500"
                  : "hover:bg-red-700"
              }`}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: 0,
                }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Xin chào, {user?.role === "DOCTOR" ? "BS." : ""}{" "}
                {user?.fullName}
              </h2>
              <p className="text-gray-600">
                {user?.location && `Phòng khám: ${user.location}`}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Đăng Xuất
            </button>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboardLayout;
