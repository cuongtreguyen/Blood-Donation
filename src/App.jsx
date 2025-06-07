import React from 'react';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { UserProvider } from './contexts/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DoctorDashboardLayout from './components/layout/DoctorDashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage from './page/homepage/HomePage';
import LoginPage from './page/loginpage/LoginPage';
import RegisterPage from './page/loginpage/RegisterPage';

// Admin Pages
import AdminDashboard from './page/admin/AdminDashboard';
import AdminUsersPage from './page/admin/AdminUsersPage';
import AdminBloodBanksPage from './page/admin/AdminBloodBanksPage';
import AdminDonationsPage from './page/admin/AdminDonationsPage';
import AdminStatisticsPage from './page/admin/AdminStatisticsPage';
import AdminSettingsPage from './page/admin/AdminSettingsPage';
import AdminProfilePage from './page/admin/AdminProfilePage';
import AdminNotificationsPage from './page/admin/AdminNotificationsPage';
import BlogPage from './page/admin/BlogPage';

// Doctor Pages
import DoctorDashboardPage from './pages/doctor/DashboardPage';
import DoctorDonorsPage from './pages/doctor/DonorsPage';
import DoctorMedicalRecordsPage from './pages/doctor/MedicalRecordsPage';
import DoctorBloodInventoryPage from './pages/doctor/BloodInventoryPage';
import DoctorReportsPage from './pages/doctor/ReportsPage';
import DoctorProfilePage from './pages/doctor/ProfilePage';
import DonateUser from './page/userpage/DonateUser';
import ForgotPassword from './page/loginpage/ForgotPassword';


import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import OtpVerification from './page/loginpage/OtpVerification';
// import PasswordResetForm from './page/loginpage/OtpVerification';
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/user",
    element: <DonateUser />,
  },
  {
    path: "otp",
    element: <OtpVerification/>,
  },
  {
    path: "/doctor",
    element: <DoctorDashboardLayout />,
    children: [
      {
        path: "",
        element: <DoctorDashboardPage />,
      },
      {
        path: "donors",
        element: <DoctorDonorsPage />,
      },
      {
        path: "medical-records",
        element: <DoctorMedicalRecordsPage />,
      },
      {
        path: "blood-inventory",
        element: <DoctorBloodInventoryPage />,
      },
      {
        path: "reports",
        element: <DoctorReportsPage />,
      },
      {
        path: "profile",
        element: <DoctorProfilePage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "blood-banks",
        element: <AdminBloodBanksPage />,
      },
      {
        path: "donations",
        element: <AdminDonationsPage />,
      },
      {
        path: "statistics",
        element: <AdminStatisticsPage />,
      },
      {
        path: "notifications",
        element: <AdminNotificationsPage />,
      },
      {
        path: "settings",
        element: <AdminSettingsPage />,
      },
      {
        path: "profile",
        element: <AdminProfilePage />,
      },
      {
        path: "blogs",
        element: <BlogPage />,
      },
    ],
  },
]);

function App() {
  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider
        locale={viVN}
        theme={{
          token: {
            colorPrimary: '#d32f2f',
          },
        }}
      >

        <UserProvider>
          <RouterProvider router={router} />

        </UserProvider>
      </ConfigProvider>
    </PersistGate>
  </Provider>
);

}

export default App;