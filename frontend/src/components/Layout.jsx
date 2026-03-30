import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div className="bg-black min-h-screen text-slate-100 flex flex-col selection:bg-teal-500/30">
      <Navbar onToggleSidebar={toggleSidebar} sidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="flex-1 overflow-x-hidden pt-14 sm:pt-[3.5rem] transition-[padding] duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;
