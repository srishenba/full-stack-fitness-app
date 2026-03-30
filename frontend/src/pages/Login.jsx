import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, ChevronLeft, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BrandText from '../components/BrandText';
import InputGroup from '../components/ui/InputGroup';
import logo from '../assets/logo.png';
import Navbar from '../components/Navbar';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [strength, setStrength] = useState("");
  const { login, token } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, go straight to dashboard
  useEffect(() => {
    if (token) {
      window.location.href = '/dashboard';
    }
  }, [token]);

  const checkStrength = (pass) => {
    if (!pass) return "";
    if (pass.length < 6) return "Weak";
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/)) return "Strong";
    return "Medium";
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      setErrors({ username: '', password: '' });

      const newErrors = { username: '', password: '' };
      if (!username.trim()) newErrors.username = 'Please enter your email address';
      if (!password.trim()) {
        newErrors.password = 'Please enter your password';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (newErrors.username || newErrors.password) {
        setErrors(newErrors);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setSubmitting(false);
        return;
      }

      setSubmitting(true);
      try {
        const email = username.trim().toLowerCase();
        const res = await api.post('/api/auth/signin', { email, password });
        const data = res.data;

        // Accept either { success: true, token } or { token } (old backend format)
        if (data.token) {
          login(data.token, data.user);
          toast.success('Welcome back.');
          // Full page redirect ensures protected route reads fresh token from localStorage
          window.location.href = '/dashboard';
        } else {
          const msg = data.message || 'Invalid email or password.';
          setError(msg);
          toast.error(msg);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
        setError(msg);
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [username, password, login, navigate]
  );

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-5rem)]">
        <div className="absolute inset-0 z-[-1] overflow-hidden">
        {/* Background Image (Logo blurred) */}
        <img
          src={logo}
          alt="background"
          className="w-full h-full object-cover blur-3xl scale-125 opacity-20"
        />
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black to-slate-950" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md glass p-10 md:p-14 rounded-[3rem] border border-teal-500/20 shadow-[0_0_80px_rgba(20,184,166,0.15)] hover:shadow-[0_0_100px_rgba(20,184,166,0.25)] transition-all duration-500 overflow-hidden"
      >
        <Link to="/" className="absolute top-10 left-10 text-teal-500/60 hover:text-teal-400 text-[10px] transition-colors flex items-center gap-1.5 font-black uppercase tracking-[0.2em] group">
           <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        <div className="flex flex-col items-center gap-6 mb-8 text-center pt-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Meal <span className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">Move</span>
          </h1>

        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div className="space-y-1">
            <InputGroup
              label="Email Address"
              type="email"
              value={username}
              onValueChange={(val) => {
                setUsername(val);
                setErrors(prev => ({ ...prev, username: "" }));
              }}
              icon={<Mail size={18} />}
              placeholder="e.g., name@example.com"
              autoComplete="email"
              error={errors.username}
              success={!errors.username && username.includes('@')}
              containerClass={shake && errors.username ? "animate-shake" : ""}
              inputClassExtra="focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1 px-2 font-bold tracking-wide">
                {errors.username}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <InputGroup
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onValueChange={(val) => {
                setPassword(val);
                setErrors(prev => ({ ...prev, password: "" }));
                setStrength(checkStrength(val));
              }}
              icon={<Lock size={18} />}
              rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              onRightIconClick={() => setShowPassword(!showPassword)}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password}
              success={!errors.password && password.length >= 6}
              containerClass={shake && errors.password ? "animate-shake" : ""}
              inputClassExtra="focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40"
            />
            {password && (
              <div className="px-2 pt-1">
                <p className={`text-[10px] font-black uppercase tracking-widest ${
                  strength === "Weak" ? "text-red-400" : strength === "Medium" ? "text-yellow-400" : "text-green-400"
                }`}>
                  Strength: {strength}
                </p>
                <div className="h-1 mt-1.5 rounded-full bg-white/5 overflow-hidden w-full max-w-[120px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: strength === "Weak" ? "33.33%" : strength === "Medium" ? "66.66%" : "100%",
                      backgroundColor: strength === "Weak" ? "#f87171" : strength === "Medium" ? "#fbbf24" : "#4ade80"
                    }}
                    className="h-full transition-all duration-500"
                  />
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 px-2 font-bold tracking-wide">
                {errors.password}
              </p>
            )}
            {/* Forgot Password Link */}
            <div className="flex justify-end mt-1 px-1">
              <button
                type="button"
                onClick={() => toast('Password reset feature coming soon!', { icon: '🔐' })}
                className="text-teal-400/70 hover:text-teal-300 text-[10px] font-bold uppercase tracking-widest transition-colors hover:underline underline-offset-2"
              >
                Forgot Password?
              </button>
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[10px] font-black uppercase tracking-widest px-2 flex items-center gap-2"
              >
                <AlertCircle size={12} /> {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 py-5 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-900 hover:from-teal-600 hover:to-teal-800 text-white font-black uppercase tracking-widest text-sm transition-all shadow-[0_20px_40px_rgba(20,184,166,0.35)] hover:shadow-[0_25px_50px_rgba(20,184,166,0.5)] hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition duration-500"></span>
            {submitting ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn className="inline-block mr-2" size={18} /> Login
              </>
            )}
          </button>
        </form>

        <p className="mt-12 text-center text-slate-600 text-[11px] font-semibold tracking-wide">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-teal-400 font-bold hover:text-teal-300 relative transition-all duration-300 group inline-block hover:scale-105"
          >
            Create one
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default React.memo(Login);
