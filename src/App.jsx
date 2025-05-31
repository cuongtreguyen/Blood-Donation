import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import './index.css';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage from './page/homepage/HomePage';
import LoginPage from './page/loginpage/LoginPage';
import RegisterPage from './page/loginpage/RegisterPage';
import DashboardPage from './page/dashboard/DashboardPage';
import AdminDashboard from './page/admin/AdminDashboard';
import AdminUsersPage from './page/admin/AdminUsersPage';
import AdminBloodBanksPage from './page/admin/AdminBloodBanksPage';
import AdminDonationsPage from './page/admin/AdminDonationsPage';
import AdminStatisticsPage from './page/admin/AdminStatisticsPage';
import AdminSettingsPage from './page/admin/AdminSettingsPage';
import AdminProfilePage from './page/admin/AdminProfilePage';

// New imports based on the provided image structure
import DonorsPage from './page/dashboard/DonorsPage';
import MedicalRecordsPage from './page/dashboard/MedicalRecordsPage';
import DonateUser from './page/userpage/DonateUser';
import ForgotPassword from './page/loginpage/ForgotPassword';

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
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "donors",
        element: <DonorsPage />,
      },
      {
        path: "medical-records",
        element: <MedicalRecordsPage />,
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
        path: "dashboard",
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
        path: "settings",
        element: <AdminSettingsPage />,
      },
      {
        path: "profile",
        element: <AdminProfilePage />,
      },
    ],
  },
  {
    path: "/user",
    element: <DonateUser />,
  },
  {
    path: "/ResetPassword",
    element: <ForgotPassword />,
  },
]);

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#d32f2f',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;