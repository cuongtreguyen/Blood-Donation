
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
   <>
    <Header/>
    <main className='min-h-screen pt-[100px] bg-gray-100'>
    <Outlet/>
    </main>
    <Footer/>
   </>
  );
}

export default MainLayout;
