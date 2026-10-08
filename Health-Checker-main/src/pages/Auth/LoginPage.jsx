import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Mail, Lock, LogIn, ArrowRight, UserCheck, Stethoscope, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (res?.success) {
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'doctor') navigate('/doctor/dashboard');
        else navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role) => {
    const res = await switchDemoUser(role);
    if (res?.success) {
      if (role === 'admin') navigate('/admin');
      else if (role.startsWith('doctor')) navigate('/doctor/dashboard');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl health-gradient flex items-center justify-center text-white mx-auto shadow-md">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to access your consultations and health locker</p>
        </div>

        {/* Quick Demo Logins Box */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
          <p className="text-[11px] font-bold text-slate-600 text-center uppercase tracking-wider">
            ⚡ 1-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('patient')}
              className="py-1.5 px-2 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-bold text-[11px] border border-slate-200 shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3" /> Patient
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('doctor')}
              className="py-1.5 px-2 rounded-xl bg-white hover:bg-teal-50 text-teal-700 font-bold text-[11px] border border-slate-200 shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <Stethoscope className="w-3 h-3" /> Doctor
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-[11px] border border-slate-200 shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-sky-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl health-gradient text-white font-bold text-xs shadow-md shadow-sky-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-sky-600 hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
