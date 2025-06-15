import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import EmergencyBanner from './EmergencyBanner';
import ContactButton from './ContactButton';
import ChatBox from '../chat/ChatBox';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div style={{ position: 'relative', marginTop: '100px' }}>
        <EmergencyBanner />
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