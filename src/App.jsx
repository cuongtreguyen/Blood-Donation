  


import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./page/homepage/HomePage";
import LoginPage from "./page/loginpage/LoginPage";
import MainLayout from "./components/layout/MainLayout";
import RegisterPage from "./page/loginpage/RegisterPage";
import DonateUser from "./page/userpage/donateuser";
import ForgotPassword from "./page/loginpage/ForgotPassword";




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
},{
  path: "/login",
  element: <LoginPage />,
},{
  path: "/register",
  element: <RegisterPage />,
},{
  path: "/user",
  element: <DonateUser />,
},{
  path: "/ResetPassword",
  element: <ForgotPassword/>,
}

  ])


  return (
    <>
     <RouterProvider router={router} />
    </>

  );
}

export default App;