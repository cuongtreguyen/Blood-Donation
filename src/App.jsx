// src/App.jsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./page/homepage/HomePage";
import LoginPage from "./page/loginpage/LoginPage";
import MainLayout from "./components/layout/MainLayout";

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
}

  ])


  return (
    <>
     <RouterProvider router={router} />
    </>
  );
}

export default App;