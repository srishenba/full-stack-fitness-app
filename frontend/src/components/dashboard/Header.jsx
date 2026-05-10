import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ userData }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-4 z-40 px-6 py-4 mx-6 mt-4 rounded-2xl bg-gradient-to-r from-teal-600/90 to-emerald-500/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(13,148,136,0.3)] transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left Side: Page Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-white/90 drop-shadow-md">Dashboard</span>
        </div>

        {/* Center: Welcome Message & User ID */}
        <div className="hidden md:flex flex-col items-center">
          <h2 className="text-sm font-bold text-white drop-shadow-sm">
            Welcome <span className="text-white font-black">{userData?.name || 'Shenbagam'}</span> 👋
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20 font-mono tracking-widest backdrop-blur-sm">
              MM-{userData?._id?.slice(-5).toUpperCase() || '10293'}
            </span>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all group">
            <span className="text-lg group-hover:scale-110 transition-transform inline-block">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full border-2 border-teal-600 animate-pulse"></span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all group"
            >
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold border border-white/20">
                {userData?.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <span className="text-sm font-medium text-white group-hover:scale-110 transition-all">👤</span>
              <span className={`text-[10px] text-white/70 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl bg-slate-900 border border-white/10 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
                  >
                    <span>👤</span> My Profile
                  </button>
                  <button 
                    onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
                  >
                    <span>⚙️</span> Settings
                  </button>
                  <button 
                    onClick={() => { navigate('/progress'); setIsProfileOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
                  >
                    <span>📈</span> Progress Report
                  </button>
                  <div className="my-1 border-t border-white/5"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className="hidden sm:flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all shadow-lg hover:shadow-white/20 group"
            title="Logout"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;