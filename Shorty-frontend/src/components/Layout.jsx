import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    // Sets the global background to your custom dark color
    <div className="bg-[#040F0F] min-h-screen text-white font-sans flex flex-col">
      <Navbar />
      <main className="w-full flex-grow flex items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;