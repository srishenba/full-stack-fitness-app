import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Save, ChevronLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import InputGroup from '../components/ui/InputGroup';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        setSuccess(true);
        toast.success(res.data.message || 'Password reset successful');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(res.data.message || 'Reset link expired');
        toast.error(res.data.message || 'Reset link expired');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Try again later';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [password, confirmPassword, token, navigate]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-5rem)] bg-black/95">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md glass p-10 md:p-14 rounded-[3rem] border border-teal-500/20 shadow-[0_0_80px_rgba(20,184,166,0.15)]"
        >
          <div className="flex flex-col items-center gap-6 mb-8 text-center pt-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">
              Set <span className="text-teal-400">New Password</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Almost there. Please enter a strong new password to regain access.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <InputGroup
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onValueChange={setPassword}
                icon={<Lock size={18} />}
                rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                onRightIconClick={() => setShowPassword(!showPassword)}
                placeholder="••••••••"
                required
              />

              <InputGroup
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                icon={<Lock size={18} />}
                placeholder="••••••••"
                required
              />

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-[10px] font-black uppercase tracking-widest px-2 flex items-center gap-2"
                >
                  <Lock size={12} /> {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={submitting || !password || !confirmPassword}
                className="mt-6 py-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-[0_20px_40px_rgba(20,184,166,0.2)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Resetting...' : (
                  <span className="flex items-center justify-center gap-2">
                    <Save size={18} /> Update Password
                  </span>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-teal-400" size={32} />
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4">Password reset successful</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                Redirecting you to login page...
              </p>
              <Link
                to="/login"
                className="inline-block py-4 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px]"
              >
                Return to Login Now
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;
