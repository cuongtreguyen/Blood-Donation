import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaNotesMedical,
  FaTint,
  FaFileAlt,
  FaUserCircle,
} from "react-icons/fa";

function DoctorDashboardLayout() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { to: "/doctor", label: "Tổng Quan", icon: <FaTachometerAlt /> },
    { to: "/doctor/donors", label: "Người Hiến Máu", icon: <FaUser /> },
    { to: "/doctor/medical-records", label: "Hồ Sơ Y Tế", icon: <FaNotesMedical /> },
    { to: "/doctor/blood-inventory", label: "Kho Máu", icon: <FaTint /> },
    { to: "/doctor/reports", label: "Báo Cáo", icon: <FaFileAlt /> },
    { to: "/doctor/profile", label: "Hồ Sơ Cá Nhân", icon: <FaUserCircle /> },
  ];

  useEffect(() => {
    // Redirect if not logged in or not a doctor
    if (!user || user.role !== 'DOCTOR') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-red-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Bác Sĩ Dashboard</h1>
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
            <h2 className="text-xl font-semibold">Xin chào, BS. {user?.name}</h2>
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
