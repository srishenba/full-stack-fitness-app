import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ChevronLeft, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import InputGroup from '../components/ui/InputGroup';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setError('');
    
    try {
      const res = await api.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      if (res.data.success) {
        setSuccess(true);
        toast.success(res.data.message || 'Reset link sent to your email');
      } else {
        setError(res.data.message || 'User not found');
        toast.error(res.data.message || 'User not found');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Try again later';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [email]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-5rem)] bg-black/95">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md glass p-10 md:p-14 rounded-[3rem] border border-teal-500/20 shadow-[0_0_80px_rgba(20,184,166,0.15)]"
        >
          <Link to="/login" className="absolute top-10 left-10 text-teal-500/60 hover:text-teal-400 text-[10px] transition-colors flex items-center gap-1.5 font-black uppercase tracking-[0.2em] group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>

          <div className="flex flex-col items-center gap-6 mb-8 text-center pt-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">
              Forgot <span className="text-teal-400">Password?</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <InputGroup
                label="Email Address"
                type="email"
                value={email}
                onValueChange={setEmail}
                icon={<Mail size={18} />}
                placeholder="e.g., name@example.com"
                required
              />

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-[10px] font-black uppercase tracking-widest px-2 flex items-center gap-2"
                >
                  <AlertCircle size={12} /> {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={submitting || !email}
                className="mt-6 py-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-[0_20px_40px_rgba(20,184,166,0.2)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={18} /> Send Reset Link
                  </span>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-teal-400" size={32} />
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4">Check Your Inbox</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                Reset link sent to your email. Please follow the instructions to secure your account.
              </p>
              <Link
                to="/login"
                className="inline-block py-4 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-teal-600 transition-all"
              >
                Return to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
