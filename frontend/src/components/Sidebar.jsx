import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Utensils,
  Zap,
  Bot,
  LayoutDashboard,
  Grid,
  Settings,
  X,
} from 'lucide-react';

const spring = { type: 'spring', stiffness: 420, damping: 38 };

const Sidebar = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleReady = () => setCanInstall(true);
    window.addEventListener('pwa-install-ready', handleReady);
    return () => window.removeEventListener('pwa-install-ready', handleReady);
  }, []);

  const handleInstall = () => {
    if (window.showInstallPrompt) {
      window.showInstallPrompt();
    }
  };

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <motion.div
          key="sidebar-root"
          className="fixed inset-0 z-[120] md:z-[120]"
          initial={{ pointerEvents: 'none' }}
          animate={{ pointerEvents: 'auto' }}
          exit={{ pointerEvents: 'none' }}
        >
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="App navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={spring}
            className="absolute right-0 top-0 bottom-0 flex w-[min(100vw,20rem)] sm:w-80 flex-col border-l border-teal-500/20 bg-black/75 backdrop-blur-2xl p-6 pt-20 shadow-[-12px_0_40px_rgba(20,184,166,0.12)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-teal-500/40 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>

            <div className="mb-8 flex items-center gap-3 px-1">
              <span className="text-[9px] font-black uppercase tracking-[0.55em] text-slate-600">Ecosystem</span>
              <div className="h-px flex-1 bg-gradient-to-r from-teal-500/25 to-transparent" />
            </div>

            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
              {sidebarLinks.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={onClose} className="block">
                  {({ isActive }) => (
                    <motion.div
                      layout
                      className={`group flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all ${
                        isActive
                          ? 'border-teal-400/50 bg-teal-600/20 text-white shadow-[0_0_24px_rgba(20,184,166,0.2)]'
                          : 'border-white/5 text-slate-500 hover:border-teal-500/25 hover:bg-teal-500/5 hover:text-teal-300'
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all group-hover:border-teal-400/30 group-hover:shadow-[0_0_14px_rgba(20,184,166,0.25)]">
                        {item.icon}
                      </span>
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#2dd4bf]" />
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/5 pt-6">
              <div className="rounded-3xl border border-teal-500/15 bg-gradient-to-br from-teal-900/30 to-black/40 p-6">
                <h4 className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.35em] text-teal-400">
                  <Zap size={12} className="text-teal-400" />
                  OS Node
                </h4>
                <p className="text-[9px] font-semibold uppercase leading-relaxed tracking-wide text-slate-600">
                  Sync meal & fitness modules from the command center.
                </p>
              </div>
              
              {canInstall && (
                <button
                  onClick={handleInstall}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-3 text-[10px] font-black uppercase tracking-[0.2em] text-teal-300 hover:bg-teal-500/20 transition-all"
                >
                  <Zap size={14} className="animate-pulse" />
                  Install App
                </button>
              )}

              <div className="mt-4 flex items-center justify-between px-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">
                <span>V2.1</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const sidebarLinks = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <Bot size={20} />, label: 'AI Coach', path: '/ai-coach' },
  { icon: <Activity size={20} />, label: 'Fitness', path: '/fitness' },
  { icon: <Utensils size={20} />, label: 'Nutrition', path: '/nutrition' },
  { icon: <Grid size={20} />, label: 'Meal Plans', path: '/meals' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
];

export default React.memo(Sidebar);
