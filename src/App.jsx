// src/App.jsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./page/homepage/HomePage";
import LoginPage from "./page/loginpage/LoginPage";
import MainLayout from "./components/layout/MainLayout";
import RegisterPage from "./page/loginpage/RegisterPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./page/dashboard/DashboardPage";
import DonorsPage from "./page/dashboard/DonorsPage";
import MedicalRecordsPage from "./page/dashboard/MedicalRecordsPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children:[
        {
          path:"",
          element: <HomePage />
        }
      ]
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage/>,
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          path: "",
          element: <DashboardPage />
        },
        {
          path: "donors",
          element: <DonorsPage />
        },
        {
          path: "medical-records",
          element: <MedicalRecordsPage />
        }
      ]
    }
  ])

  return (
    <>
     <RouterProvider router={router} />
    </>
  );
}

export default App;