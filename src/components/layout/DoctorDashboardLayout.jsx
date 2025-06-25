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
} from "react-icons/fa";

function DoctorDashboardLayout() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { to: "/doctor", label: "Tổng Quan", icon: <FaTachometerAlt /> },
    { to: "/doctor/donors", label: "Người Hiến Máu", icon: <FaUser /> },
    {
      to: "/doctor/medical-records",
      label: "Hồ Sơ Y Tế",
      icon: <FaNotesMedical />,
    },
    { to: "/doctor/blood-inventory", label: "Kho Máu", icon: <FaTint /> },
    { to: "/doctor/reports", label: "Báo Cáo", icon: <FaFileAlt /> },
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
      <div className="w-64 bg-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">{user?.role === "DOCTOR" ? "Bác Sĩ" : "Nhân Viên"} Dashboard</h1>
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
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
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
                Xin chào, {user?.role === "DOCTOR" ? "BS." : ""} {user?.fullName}
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
