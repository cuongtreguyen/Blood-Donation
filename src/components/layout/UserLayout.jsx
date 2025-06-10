import React from 'react';
import UserHeader from './UserHeader';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import ContactButton from './ContactButton';

function UserLayout() {
  return (
   <>
    <UserHeader/>
    <main className='min-h-screen pt-[100px] bg-gray-100'>
      <Outlet/>
    </main>
    <ContactButton />
    <Footer/>
   </>
  );
}

export default UserLayout; 