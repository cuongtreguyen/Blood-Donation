// src/App.jsx
<<<<<<< Updated upstream

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./page/homepage/HomePage";
import LoginPage from "./page/loginpage/LoginPage";
import MainLayout from "./components/layout/MainLayout";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/loginpage/LoginPage";
import RegisterPage from "./page/loginpage/RegisterPage";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    <>
     <RouterProvider router={router} />
    </>
=======
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
>>>>>>> Stashed changes
  );
}

export default App;