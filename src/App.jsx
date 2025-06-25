import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { UserProvider } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import OtpVerification from "./page/loginpage/OtpVerification";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import DoctorDashboardLayout from "./components/layout/DoctorDashboardLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Pages
import HomePage from "./page/homepage/HomePage";
import LoginPage from "./page/loginpage/LoginPage";
import RegisterPage from "./page/loginpage/RegisterPage";
import BloodRequestForm from "./page/blood-request/BloodRequestForm";
import AdminDashboard from "./page/admin/AdminDashboard";

// Admin Pages
import AdminUsersPage from "./page/admin/AdminUsersPage";
import AdminStatisticsPage from "./page/admin/AdminStatisticsPage";
import AdminSettingsPage from "./page/admin/AdminSettingsPage";
import AdminProfilePage from "./page/admin/AdminProfilePage";
import AdminNotificationsPage from "./page/admin/AdminNotificationsPage";
import BlogPage from "./page/admin/BlogPage";
import BloodUnitsManagement from "./page/admin/BloodUnitsManagement";
import EmergencyBloodRequestsPage from "./page/admin/EmergencyBloodRequestsPage";
import DonationConfirmationPage from "./page/admin/DonationConfirmationPage";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import BloodDonationApprovalPage from "./page/admin/BloodDonationApprovalPage";

// Doctor Pages
import DoctorDashboardPage from "./page/doctorpage/doctor/DashboardPage";
import DoctorDonorsPage from "./page/doctorpage/doctor/DonorsPage";
import DoctorMedicalRecordsPage from "./page/doctorpage/doctor/MedicalRecordsPage";
import DoctorReportsPage from "./page/doctorpage/doctor/ReportsPage";
import ForgotPassword from "./page/loginpage/ForgotPassword";
import DonateUser from "./page/userpage/DonateUser";
import DoctorBloodInventoryPage from "./page/doctorpage/dashboard/BloodInventoryPage";
import DoctorProfilePage from "./page/doctorpage/dashboard/ProfilePage";
import DoctorSettingsPage from "./page/doctorpage/dashboard/SettingsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "blood-request", element: <BloodRequestForm /> },
      { path: "verify-otp", element: <OtpVerification /> },
      { path: "user", element: <DonateUser /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "blood-units", element: <BloodUnitsManagement /> },
      { path: "statistics", element: <AdminStatisticsPage /> },
      { path: "settings", element: <AdminSettingsPage /> },
      { path: "profile", element: <AdminProfilePage /> },
      { path: "notifications", element: <AdminNotificationsPage /> },
      { path: "blogs", element: <BlogPage /> },
      { path: "blood-requests", element: <EmergencyBloodRequestsPage /> },
      { path: "donation-confirmation", element: <DonationConfirmationPage /> },
      { path: "blood-donation-approval", element: <BloodDonationApprovalPage /> },
    ],
  },
  {
    path: "/doctor",
    element: <DoctorDashboardLayout />,
    children: [
      { index: true, element: <DoctorDashboardPage /> },
      { path: "donors", element: <DoctorDonorsPage /> },
      { path: "medical-records", element: <DoctorMedicalRecordsPage /> },
      { path: "reports", element: <DoctorReportsPage /> },
      { path: "blood-inventory", element: <DoctorBloodInventoryPage /> },
      { path: "profile", element: <DoctorProfilePage /> },
      { path: "settings", element: <DoctorSettingsPage /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider locale={viVN}>
          <UserProvider>
            <RouterProvider router={router} />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </UserProvider>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
