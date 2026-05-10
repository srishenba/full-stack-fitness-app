import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useNotificationSystem } from '../hooks/useNotificationSystem';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  useNotificationSystem(); // ✅ Initialize Smart Notifications
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((open) => !open);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSidebarOpen, closeSidebar]);

  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/ai-') ||
                      location.pathname.startsWith('/profile') ||
                      location.pathname.startsWith('/settings');

  return (
    <div className="bg-black min-h-screen text-slate-100 flex flex-col selection:bg-teal-500/30">
      {!isDashboard && <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={isSidebarOpen} />}
      {!isDashboard && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}

      <main className={`flex-1 overflow-x-hidden ${!isDashboard ? 'pt-14 sm:pt-[3.5rem]' : ''} transition-[padding] duration-300`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

