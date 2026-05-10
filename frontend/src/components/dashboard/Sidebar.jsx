import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'AI Analysis', icon: '🤖', path: '/ai-analysis' },
    { name: 'Add Meal', icon: '🍲', path: '/add-meal' },
    { name: 'Progress Report', icon: '📈', path: '/progress-report' },
    { name: 'Water Tracker', icon: '💧', path: '/water-tracker' },
    { name: 'Workout', icon: '🏃', path: '/workout' },
    { name: 'Profile', icon: '👤', path: '/profile' },
    { name: 'Settings', icon: '⚙', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all hover:scale-110 active:scale-95"
      >
        <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-0 h-full z-40 transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0 w-full md:w-64' : '-translate-x-full lg:translate-x-0 lg:w-64'}
        bg-gradient-to-b from-[#022c22] via-[#020617] to-[#020617] backdrop-blur-3xl border-r border-teal-500/20 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]
      `}>
        {/* Back to Home & Logo Section */}
        <div className="p-6 flex flex-col gap-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-teal-400/70 hover:text-teal-400 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
          </button>

          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img
              src={logo}
              alt="Meal Move Logo"
              className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <span className="text-xl font-black bg-gradient-to-r from-white via-teal-100 to-teal-300 bg-clip-text text-transparent tracking-tighter uppercase">
              Meal <span className="text-emerald-400">Move</span>
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide py-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                ${isActive(item.path) 
                  ? 'bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-white border-l-4 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                }
              `}
            >
              <span className={`text-xl transition-all duration-300 group-hover:scale-110 ${isActive(item.path) ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-sm font-bold tracking-wide transition-colors ${isActive(item.path) ? 'text-white' : 'group-hover:text-white'}`}>
                {item.name}
              </span>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          ))}
        </nav>

        {/* Bottom Section: Profile Preview */}
        <div className="p-6 border-t border-teal-900/50 bg-[#020617]/50">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-500/5 border border-teal-500/10 hover:border-teal-400/40 transition-all cursor-pointer group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
              <span className="text-lg text-white">👤</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-white truncate">Shenbagam</span>
              <span className="text-[10px] text-teal-400/70 font-bold uppercase tracking-wider">Verified</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacing for Desktop Fixed Sidebar */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;

