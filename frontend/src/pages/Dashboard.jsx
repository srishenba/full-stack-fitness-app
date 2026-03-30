import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Activity, Droplets, Zap, Utensils, AlertCircle, User, Heart, 
  Coffee, Medal, Loader2, Ruler, Weight, Calendar, CheckCircle2,
  FileText, Camera, Smartphone, ChevronRight, Brain, Baby,
  TrendingUp, Flame, Plus, X as XIcon, ImagePlus,
  LayoutDashboard, Settings, LogOut, UserCircle, Menu, ChevronLeft, Bell, Moon, Sun, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BrandText from '../components/BrandText';
import logo from '../assets/logo.png';

// Premium Card Component for Dashboard Sections
const DashboardCard = ({ title, icon, color = "teal", children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass p-10 md:p-12 rounded-[3.5rem] border border-white/10 relative shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-full group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl ${color === 'red' ? 'bg-gradient-to-br from-red-500/[0.05] to-transparent hover:border-red-500/30' : 'bg-gradient-to-br from-teal-500/[0.05] to-transparent hover:border-teal-500/30'} `}
  >
    {/* Decorative background glow */}
    <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] -translate-x-[-10%] -translate-y-[10%] opacity-30 transition-all duration-700 group-hover:opacity-60 rounded-full ${color === 'red' ? 'bg-red-500' : 'bg-teal-500'}`} />
    
    <div className="flex items-center gap-6 mb-10">
      <div className={`p-4 rounded-2xl border transition-all ${
        color === 'red' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-teal-500/10 border-teal-500/20 text-teal-400 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]'
      }`}>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black uppercase tracking-tight text-white">{title}</h3>
        <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Profile Intelligence</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
      {children}
    </div>
  </motion.div>
);

const MetricItem = ({ label, value, unit, icon: Icon }) => (
  <div className="flex flex-col gap-1 group/item">
    <div className="flex items-center gap-2 mb-1">
      {Icon && <Icon size={12} className="text-slate-600 transition-colors group-hover/item:text-teal-400" />}
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
    </div>
    <div className="flex items-baseline gap-1.5 ml-4">
      <span className="text-xl font-black text-white">{value || '---'}</span>
      {unit && value && <span className="text-[10px] font-black uppercase text-teal-500/60 tracking-widest">{unit}</span>}
    </div>
  </div>
);

const FileIndicator = ({ label, exists }) => (
  <div className="flex items-center gap-2 py-1 px-3 bg-white/5 rounded-xl border border-white/5 w-fit h-fit">
    <FileText size={12} className={exists ? "text-teal-400" : "text-slate-700"} />
    <span className={`text-[9px] font-black uppercase tracking-widest ${exists ? "text-slate-300" : "text-slate-700 italic"}`}>
      {label}: {exists ? "Active" : "None"}
    </span>
  </div>
);

const Dashboard = () => {
  const { token, logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notifications] = useState([
    { id: 1, title: 'Profile updated', message: 'Your biometric data has been seamlessly synchronized.', read: false, time: '2m ago' },
    { id: 2, title: 'New feature added', message: 'The AI Evolution Engine is fully online and ready for analysis.', read: false, time: '1h ago' },
    { id: 3, title: 'Action Verified', message: 'Data synchronization successful.', read: true, time: 'Yesterday' }
  ]);

  // ── Sensor Tracking State ─────────────────────────────────────────────────
  const [steps, setSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [sensorError, setSensorError] = useState('');

  const requestMotionPermission = async () => {
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === 'granted') {
          startTracking();
        } else {
          setSensorError('Permission denied');
        }
      } else {
        startTracking();
      }
    } catch (error) {
      setSensorError('Sensors unsupported');
      console.error(error);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setSensorError('');
    let lastMagnitude = 0;
    
    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || event.acceleration || {x:0, y:0, z:0};
      if (x === null || y === null || z === null) return;
      
      const magnitude = Math.sqrt(x*x + y*y + z*z);
      if (magnitude > 12 && lastMagnitude <= 12) {
        setSteps(prev => prev + 1);
      }
      lastMagnitude = magnitude;
    };
    
    window.addEventListener('devicemotion', handleMotion);
    window._motionHandler = handleMotion;
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (window._motionHandler) {
      window.removeEventListener('devicemotion', window._motionHandler);
      window._motionHandler = null;
    }
  };

  useEffect(() => {
    return () => {
      if (window._motionHandler) {
        window.removeEventListener('devicemotion', window._motionHandler);
      }
    };
  }, []);

  // ── Stats Card State ──────────────────────────────────────────────────────
  const [meals, setMeals] = useState([
    { id: 1, name: 'Breakfast', calories: 0, photo: null }
  ]);
  const [newMealName, setNewMealName] = useState('');
  const [newMealCal, setNewMealCal] = useState('');

  const addMeal = () => {
    if (!newMealName.trim()) return;
    setMeals(prev => [
      ...prev,
      { id: Date.now(), name: newMealName.trim(), calories: Number(newMealCal) || 0, photo: null }
    ]);
    setNewMealName(''); setNewMealCal('');
  };

  const removeMeal = (id) => setMeals(prev => prev.filter(m => m.id !== id));

  const handleMealPhoto = (id, file) => {
    const url = URL.createObjectURL(file);
    setMeals(prev => prev.map(m => m.id === id ? { ...m, photo: url } : m));
  };

  const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.get('/api/user/profile');
      setUserData(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not access protocol.';
      setError(msg);
      toast.error(msg);
    } finally {
      const delay = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(delay);
    }
  }, [token]);

  const startAiAnalysis = async () => {
    if (!userData) return;
    setAiLoading(true);
    try {
      const { data } = await api.post('/api/user/ai-analysis', userData);
      setAiAnalysis(data);
      toast.success("AI Analysis Complete! 🧬");
    } catch (err) {
      toast.error("AI Synchronization Failed.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading && !userData) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-5rem)] items-center justify-center p-8 bg-black">
        <Loader2 className="animate-spin text-teal-500 mb-8" size={64} strokeWidth={1} />
        <h2 className="text-slate-400 font-black uppercase tracking-[0.8em] text-[10px] animate-pulse">Syncing Evolution...</h2>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-5rem)] items-center justify-center p-8 bg-black">
        <div className="glass p-14 rounded-[4rem] border border-red-500/20 max-w-md text-center shadow-2xl">
          <AlertCircle className="mx-auto mb-8 text-red-500" size={56} strokeWidth={1} />
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">Sync Protocol Interrupted</h2>
          <p className="text-slate-500 font-bold mb-10 text-sm">{error}</p>
          <button 
            onClick={fetchProfile} 
            className="w-full py-5 rounded-3xl bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest text-[11px] transition-all mb-4"
          >
            Attempt New Sync
          </button>
          <button 
            onClick={() => { logout(); window.location.href = '/login'; }} 
            className="w-full py-5 rounded-3xl bg-transparent border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 text-slate-500 hover:text-red-400 font-black uppercase tracking-widest text-[11px] transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const u = userData || {};
  const photoUrl = u.profilePhoto ? `http://localhost:5000/${u.profilePhoto}` : null;

  return (
    <div className="flex bg-black min-h-screen relative">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={logo} alt="bg" className="w-full h-full object-cover blur-[150px] opacity-10 scale-150" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/5 via-black to-slate-950/90" />
      </div>

      {/* ── Persistent Left Sidebar ──────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="hidden md:flex flex-col fixed left-0 top-14 bottom-0 z-30 bg-black/80 backdrop-blur-xl border-r border-white/5 overflow-hidden"
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          className="flex items-center justify-end p-3 m-3 rounded-xl border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 text-slate-600 hover:text-teal-400 transition-all"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          {[
            { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
            { icon: <UserCircle size={20} />, label: 'Profile', path: '/dashboard#profile' },
            { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard#settings' },
          ].map(item => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3.5 transition-all ${
                  isActive
                    ? 'bg-teal-600/20 border border-teal-500/30 text-teal-300'
                    : 'border border-transparent text-slate-500 hover:bg-teal-500/5 hover:border-teal-500/15 hover:text-teal-300'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !sidebarCollapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => { logout(); }}
            className="flex items-center gap-3 w-full rounded-2xl px-3 py-3.5 border border-transparent text-slate-600 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all"
          >
            <span className="flex-shrink-0"><LogOut size={20} /></span>
            {!sidebarCollapsed && (
              <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ── Main Content Area ────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col p-6 lg:p-12 pt-20 sm:pt-24 relative z-10 transition-all duration-300"
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (sidebarCollapsed ? 72 : 240) : 0 }}
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-14">
        
        {/* ── Top Utility & Notifications ──────────────────────────────── */}
        <div className="flex justify-end -mb-8 relative z-50">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-teal-500/30 rounded-full transition-all text-slate-400 hover:text-teal-400 relative shadow-lg"
            >
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-black animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-80 glass bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-teal-500/10 to-transparent">
                    <h3 className="text-white font-black uppercase tracking-tight text-sm">Notifications</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-teal-500 bg-teal-500/10 px-2.5 py-1 rounded-md">
                      {notifications.filter(n => !n.read).length} New
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2 scrollbar-hide">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-2xl mb-2 flex flex-col gap-1 transition-all ${
                          notification.read ? 'hover:bg-white/[0.02]' : 'bg-teal-500/[0.05] border border-teal-500/20 hover:bg-teal-500/10 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium mt-1">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/5 text-center bg-black/50">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-teal-400 transition-colors w-full p-2"
                    >
                      Close notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Welcome Banner ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-[2.5rem] border border-teal-500/30 px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-500/[0.08] to-transparent backdrop-blur-3xl shadow-[0_20px_40px_rgba(20,184,166,0.1)] relative overflow-hidden group hover:border-teal-400/50 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-teal-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">
              Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Welcome back,{' '}
              <span className="text-teal-400">
                {u.name?.split(' ')[0] || 'User'}
              </span>{' '}
              👋
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-2">
              Here's your activity overview and health profile.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest mt-1">
              Biological Synchronization Active
            </p>
          </div>
        </motion.div>

        {/* ── Live Motion Tracking ─────────────────────────────────────── */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="glass rounded-[2rem] border border-teal-500/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-teal-500/[0.03] shadow-[0_10px_30px_rgba(20,184,166,0.1)] relative overflow-hidden group"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:opacity-60 transition-all pointer-events-none rounded-full" />
           
           <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
             <div className={`p-4 rounded-2xl border transition-all ${isTracking ? 'bg-teal-500/20 border-teal-500/30 text-teal-400 animate-pulse' : 'bg-white/5 border-white/10 text-slate-400'}`}>
               <Activity size={24} />
             </div>
             <div>
               <h3 className="text-white text-lg font-black uppercase tracking-tight">Kinetic tracking</h3>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                 {isTracking ? 'Sensors Active' : 'Sensors Idle'}
               </p>
             </div>
           </div>

           <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end relative z-10">
             {sensorError && (
               <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
                 {sensorError}
               </span>
             )}
             <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-white">{steps}</span>
                 <span className="text-[10px] text-teal-500 font-black uppercase tracking-widest">Steps</span>
             </div>
             <button 
               onClick={isTracking ? stopTracking : requestMotionPermission}
               className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isTracking ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 active:scale-95' : 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] active:scale-95'}`}
             >
               {isTracking ? 'Stop' : 'Start'}
             </button>
           </div>
        </motion.div>

        {/* ── Stats Overview Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Activities */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="glass rounded-[2rem] border border-white/10 p-7 flex flex-col gap-4 bg-gradient-to-br from-teal-500/[0.05] to-transparent backdrop-blur-2xl hover:border-teal-500/30 hover:shadow-[0_10px_30px_rgba(20,184,166,0.15)] transition-all duration-500 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all">
                <TrendingUp size={20} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-teal-500/60">Total</span>
            </div>
            <div>
              <p className="text-4xl font-black text-white">{u.activityLevel ? '1' : '0'}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Activities 📈</p>
            </div>
          </motion.div>

          {/* Meals Tracked */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="glass rounded-[2rem] border border-white/10 p-7 flex flex-col gap-4 bg-gradient-to-br from-teal-500/[0.05] to-transparent backdrop-blur-2xl hover:border-teal-500/30 hover:shadow-[0_10px_30px_rgba(20,184,166,0.15)] transition-all duration-500 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all">
                <Utensils size={20} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-teal-500/60">Tracked</span>
            </div>
            <div>
              <p className="text-4xl font-black text-white">{meals.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Meals 🍽️</p>
            </div>
          </motion.div>

          {/* Water Intake */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="glass rounded-[2rem] border border-white/10 p-7 flex flex-col gap-4 bg-gradient-to-br from-blue-500/[0.05] to-transparent backdrop-blur-2xl hover:border-blue-500/30 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] transition-all duration-500 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all">
                <Droplets size={20} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/60">Daily</span>
            </div>
            <div>
              <p className="text-4xl font-black text-white">{u.waterIntake || '0'}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Litres 💧</p>
            </div>
          </motion.div>

          {/* Calories */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            className="glass rounded-[2rem] border border-white/10 p-7 flex flex-col gap-4 bg-gradient-to-br from-orange-500/[0.05] to-transparent backdrop-blur-2xl hover:border-orange-500/30 hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)] transition-all duration-500 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] transition-all">
                <Flame size={20} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/60">Total</span>
            </div>
            <div>
              <p className="text-4xl font-black text-white">{totalCalories}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Calories 🔥</p>
            </div>
          </motion.div>
        </div>

        {/* ── Meal Tracker Card ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className="glass rounded-[2.5rem] border border-white/10 p-10 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 flex flex-col relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-30 group-hover:opacity-60 transition-all duration-700 pointer-events-none rounded-full" />
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Utensils size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Meal Tracker</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Log meals &amp; calories with photos</p>
            </div>
          </div>

          {/* Add Meal Row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              placeholder="Meal name (e.g. Lunch)"
              value={newMealName}
              onChange={e => setNewMealName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMeal()}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm font-medium placeholder:text-slate-700 outline-none focus:border-teal-500/40"
            />
            <input
              type="number"
              placeholder="Calories"
              value={newMealCal}
              onChange={e => setNewMealCal(e.target.value)}
              className="w-32 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white text-sm font-medium placeholder:text-slate-700 outline-none focus:border-teal-500/40"
            />
            <button
              onClick={addMeal}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Meal List */}
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {meals.map(meal => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:10 }}
                  className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-teal-500/15 transition-all"
                >
                  {/* Meal Photo */}
                  <label className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 cursor-pointer flex-shrink-0 hover:border-teal-500/30 transition-all">
                    {meal.photo
                      ? <img src={meal.photo} alt={meal.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center bg-white/5 text-slate-700 hover:text-teal-500 transition-colors">
                          <ImagePlus size={16} />
                        </div>
                    }
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && handleMealPhoto(meal.id, e.target.files[0])} />
                  </label>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{meal.name}</p>
                    <p className="text-teal-400/70 text-[10px] font-black uppercase tracking-widest">
                      {meal.calories ? `${meal.calories} kcal` : 'No calories logged'}
                    </p>
                  </div>

                  <button onClick={() => removeMeal(meal.id)} className="text-slate-700 hover:text-red-400 transition-colors p-1">
                    <XIcon size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Profile Header */}

        <motion.header
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-12"
        >
          <div className="flex items-center gap-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-teal-500 rounded-full blur-[30px] opacity-20 transition-all group-hover:opacity-40 scale-110" />
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white/5 relative z-10 shadow-2xl" />
              ) : (
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-900 flex items-center justify-center border-4 border-white/5 relative z-10 shadow-2xl">
                  <User size={56} className="text-slate-700" strokeWidth={1} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400"><Medal size={12} /></span>
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.6em]">Core Member</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white flex flex-col gap-1">
                <span className="text-teal-400">{u.name?.split(' ')[0] || 'Inhabitant'}</span>
                <span className="opacity-20">{u.name?.split(' ')[1] || '---'}</span>
              </h2>
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="hidden lg:flex p-8 glass rounded-[3rem] border border-white/5 items-center gap-4 bg-white/[0.01]"
          >
             <img src={logo} alt="Logo" className="w-10 h-10 object-contain opacity-50" />
             <div className="h-10 w-[1px] bg-white/5" />
             <div className="text-right">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Status</p>
               <p className="text-[11px] font-black uppercase tracking-widest text-teal-400">Biological Synchronization Active</p>
             </div>
          </motion.div>
        </motion.header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Card 1: Basic Intelligence */}
          <DashboardCard title="Basic Identity" icon={<User size={28} strokeWidth={1} />}>
            <MetricItem label="Full Name" value={u.name} icon={User} />
            <MetricItem label="Biological Marker (Age)" value={u.age} unit="YRS" icon={Calendar} />
            <MetricItem label="Email Protocol" value={u.email} icon={Smartphone} />
            <MetricItem label="Path" value={u.gender} icon={Baby} />
            <MetricItem label="Vertical Axis" value={u.height} unit="CM" icon={Ruler} />
            <MetricItem label="Mass Measurement" value={u.weight} unit="KG" icon={Weight} />
          </DashboardCard>

          {/* Card 2: Biological Diagnostics */}
          <DashboardCard title="Diagnostics" icon={<Heart size={28} strokeWidth={1} />} color={u.diabetes === 'yes' ? 'red' : 'teal'}>
            <MetricItem label="Glucose Level" value={u.sugarLevel} />
            <MetricItem label="BP Vector" value={u.bloodPressure} />
            <MetricItem label="Lipid Profile" value={u.cholesterolLevel} />
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Audit Log</span>
              <div className="flex flex-wrap gap-2">
                <FileIndicator label="Glucose" exists={!!u.sugarReportFile} />
                <FileIndicator label="BP" exists={!!u.bloodPressureReport} />
                <FileIndicator label="Lipid" exists={!!u.cholesterolReport} />
              </div>
            </div>
            <MetricItem label="Allergies" value={u.allergies} />
            <MetricItem label="Chronic State" value={u.medicalConditions} />
          </DashboardCard>

          {/* Card 3: Lifestyle Hub */}
          <DashboardCard title="Evolution Kinetic" icon={<Zap size={28} strokeWidth={1} />}>
            <MetricItem label="Activity Magnitude" value={u.activityLevel} />
            <MetricItem label="Hydration Intake" value={u.waterIntake} unit="L" icon={Droplets} />
            <MetricItem label="Recharge Cycle" value={u.sleepHours} unit="HRS" icon={Coffee} />
            <MetricItem label="Stress Amplitude" value={u.stressLevel} />
          </DashboardCard>

          {/* Card 4: Fitness & Methodology */}
          <DashboardCard title="Strategic Plan" icon={<Medal size={28} strokeWidth={1} />}>
            <MetricItem label="Primary Goal" value={u.fitnessGoal?.replace('-', ' ')} />
            <MetricItem label="Fuel Cycles" value={u.mealFrequency} unit="MEALS/DAY" icon={Utensils} />
            <MetricItem label="Protocol Pref" value={u.workoutPreference} />
            <MetricItem label="Binary Target Mass" value={u.targetWeight} unit="KG" icon={Weight} />
          </DashboardCard>

          {/* Card 5: AI Engine Analysis */}
          <motion.div
            className="md:col-span-2 glass p-10 md:p-12 rounded-[3.5rem] border border-teal-500/30 bg-gradient-to-br from-teal-500/[0.08] to-transparent backdrop-blur-3xl shadow-[0_30px_60px_rgba(20,184,166,0.15)] hover:shadow-[0_40px_80px_rgba(20,184,166,0.25)] transition-all duration-500 overflow-hidden relative group"
            layout
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400">
                  <Brain size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white">AI Evolution Engine</h3>
                  <p className="text-[10px] text-teal-500 font-bold uppercase tracking-[0.4em] mt-1">Status: Active Interface</p>
                </div>
              </div>
              
              <button
                onClick={startAiAnalysis}
                disabled={aiLoading}
                className="group relative px-8 py-4 bg-teal-600 hover:bg-teal-500 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-[0_15px_30px_rgba(20,184,166,0.2)] disabled:opacity-50 flex items-center gap-3"
              >
                {aiLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Syncing Intelligence...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} className="group-hover:scale-125 transition-transform" />
                    <span>Start AI Analysis</span>
                  </>
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {aiAnalysis ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
                >
                  <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-teal-400">
                      <Utensils size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">🥗 Meal Plan</span>
                    </div>
                    <ul className="space-y-4">
                      {aiAnalysis.mealPlan.map((item, i) => (
                        <li key={i} className="flex gap-4 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <span className="text-sm font-medium text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-teal-400">
                      <Zap size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">🏋️ Workout</span>
                    </div>
                    <ul className="space-y-4">
                      {aiAnalysis.workoutPlan.map((item, i) => (
                        <li key={i} className="flex gap-4 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <span className="text-sm font-medium text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-teal-400">
                      <Activity size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">📊 Health Tips</span>
                    </div>
                    <ul className="space-y-4">
                      {aiAnalysis.healthTips.map((item, i) => (
                        <li key={i} className="flex gap-4 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <span className="text-sm font-medium text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="p-6 rounded-full bg-teal-500/5 mb-6">
                    <Brain className="text-slate-800" size={48} strokeWidth={1} />
                  </div>
                  <p className="max-w-md text-slate-600 text-sm font-medium">
                    Initialize the AI Evolution Engine to receive data-driven insights tailored to your unique biological profile.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Recent Activity Section ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-[2.5rem] border border-white/10 p-10 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 mt-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/10 blur-[100px] -translate-y-1/2 -translate-x-1/3 opacity-30 group-hover:opacity-60 transition-all duration-700 pointer-events-none rounded-full" />
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Activity size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Recent Activity</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Your latest actions and events</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/20 transition-all group">
               <div className="flex items-center gap-5">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <LogOut size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Last Login</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">{new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
               </div>
               <span className="text-[10px] text-teal-500/60 font-black uppercase tracking-widest px-3 py-1 bg-teal-500/10 rounded-full">System</span>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/20 transition-all group">
               <div className="flex items-center gap-5">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                    <Flame size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Logged 450 Calories</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Lunch - Chicken Salad</p>
                  </div>
               </div>
               <span className="text-[10px] text-teal-500/60 font-black uppercase tracking-widest px-3 py-1 bg-teal-500/10 rounded-full">2 hours ago</span>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/20 transition-all group">
               <div className="flex items-center gap-5">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Completed Daily Goal</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Water Intake - 3L</p>
                  </div>
               </div>
               <span className="text-[10px] text-teal-500/60 font-black uppercase tracking-widest px-3 py-1 bg-teal-500/10 rounded-full">5 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/20 transition-all group">
               <div className="flex items-center gap-5">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                    <Brain size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">AI Analysis Generated</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Intelligence Sync</p>
                  </div>
               </div>
               <span className="text-[10px] text-teal-500/60 font-black uppercase tracking-widest px-3 py-1 bg-teal-500/10 rounded-full">Yesterday</span>
            </div>
          </div>
        </motion.div>

        {/* ── Settings Section ──────────────────────────────── */}
        <motion.div
          id="settings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-[2.5rem] border border-white/10 p-10 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 mt-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-30 group-hover:opacity-60 transition-all duration-700 pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-slate-400 group-hover:bg-teal-500/10 group-hover:border-teal-500/20 group-hover:text-teal-400 transition-all">
              <Settings size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Application Settings</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Manage preferences &amp; security</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Edit Profile */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-teal-500/20 transition-all group/card flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover/card:scale-110 transition-transform">
                   <User size={18} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Edit Profile</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Update personal details</p>
                </div>
              </div>
              <button 
                onClick={() => toast.success('Profile settings opened.')}
                className="w-full py-3 mt-auto rounded-2xl bg-white/5 hover:bg-teal-500/10 hover:text-teal-400 text-slate-300 text-xs font-black uppercase tracking-widest transition-all border border-transparent hover:border-teal-500/20 active:scale-95"
              >
                Configure
              </button>
            </div>

            {/* Change Password */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-all group/card flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover/card:scale-110 transition-transform">
                   <Lock size={18} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Security</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Change active password</p>
                </div>
              </div>
              <button 
                 onClick={() => toast.success('Security settings opened.')}
                 className="w-full py-3 mt-auto rounded-2xl bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 text-slate-300 text-xs font-black uppercase tracking-widest transition-all border border-transparent hover:border-orange-500/20 active:scale-95"
              >
                Update Key
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-teal-500/20 transition-all group/card flex flex-col justify-between">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 relative overflow-hidden group-hover/card:scale-110 transition-transform">
                     <AnimatePresence mode="popLayout">
                        {theme === 'dark' ? (
                           <motion.div key="moon" initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}}>
                             <Moon size={18} />
                           </motion.div>
                        ) : (
                           <motion.div key="sun" initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}}>
                             <Sun size={18} />
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold">Appearance</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                  </div>
                </div>
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${theme === 'dark' ? 'bg-teal-500' : 'bg-slate-600'}`}
                >
                  <motion.div 
                    layout
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: theme === 'dark' ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-4">
                Toggle interface theme globally across the platform. (UI Demonstration Only)
              </p>
            </div>
          </div>
        </motion.div>

          {/* Footer Area */}
          <footer className="mt-2 text-center">
             <p className="text-[9px] font-black uppercase tracking-[1em] text-slate-700">Evolution v4.2.0 | Secured Pulse Synchronization</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
