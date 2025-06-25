// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import Footer from './Footer';
// import EmergencyBanner from './EmergencyBanner';
// import ContactButton from './ContactButton';
// import ChatBox from '../chat/ChatBox';

// const MainLayout = () => {
//   return (
//     <div className="flex flex-col min-h-screen">

//       <div style={{ position: 'inherit', marginTop: '100px' }}>

//         <EmergencyBanner />
//       </div>
//       <Header />
//       <main className="flex-grow">
//         <Outlet />
//       </main>
//       <Footer />
//       <ChatBox />
//     </div>
//   );
// };

// export default MainLayout;

// Cách 1: Nếu EmergencyBanner có logic ẩn/hiện riêng
import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
// import EmergencyBanner from './EmergencyBanner';
// import ContactButton from './ContactButton';
import ChatBox from "../chat/ChatBox";

const MainLayout = () => {
  const [bannerHeight, setBannerHeight] = useState(100);
  const bannerRef = useRef(null);

  useEffect(() => {
    const checkBannerVisibility = () => {
      if (bannerRef.current) {
        const isVisible =
          bannerRef.current.offsetHeight > 0 &&
          getComputedStyle(bannerRef.current).display !== "none";
        setBannerHeight(isVisible ? 100 : 0);
      }
    };

    // Kiểm tra ban đầu
    checkBannerVisibility();

    // Theo dõi thay đổi
    const observer = new MutationObserver(checkBannerVisibility);
    if (bannerRef.current) {
      observer.observe(bannerRef.current, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div
        style={{
          position: "relative",
          marginTop: `80px`,
          transition: "margin-top 0.3s ease",
        }}
      >
      </div>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatBox />
    </div>
  );
};

export default MainLayout;
