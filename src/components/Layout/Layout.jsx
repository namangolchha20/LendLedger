import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] selection:bg-blue-500/30 transition-colors duration-500">

      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;