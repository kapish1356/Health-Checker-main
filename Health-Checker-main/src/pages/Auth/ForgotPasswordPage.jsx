import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Please enter your account email.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/auth/reset-password', {
        email,
        newPassword: newPassword || 'password123'
      });
      if (res.data.success) {
        setIsSuccess(true);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.message || 'No account found with this email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl health-gradient flex items-center justify-center text-white mx-auto shadow-md">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Reset Account Password</h2>
          <p className="text-xs text-slate-500">Enter your email address to set a new password</p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@checkhealth.com"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (default: password123)"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl health-gradient text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Updating Password...' : 'Reset & Save Password'}
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Password Updated Successfully!</h4>
            <p className="text-xs text-slate-500">You can now sign in with your updated credentials.</p>
            <Link
              to="/login"
              className="block w-full py-2.5 rounded-xl health-gradient text-white font-bold text-xs"
            >
              Back to Login
            </Link>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <Link to="/login" className="inline-flex items-center gap-1 font-bold text-sky-600 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
