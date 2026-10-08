import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Stethoscope, ShieldAlert, Sparkles } from 'lucide-react';

const DemoBar = () => {
  const { user, switchDemoUser } = useAuth();

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Quick Role Switcher:</span>
          {user ? (
            <span className="text-cyan-400 font-semibold">
              Logged in as: {user.name} ({user.role.toUpperCase()})
            </span>
          ) : (
            <span className="text-slate-400">Browsing as Guest</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => switchDemoUser('patient')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
              user?.email === 'patient@checkhealth.com'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Patient (Rahul)
          </button>

          <button
            onClick={() => switchDemoUser('doctor')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
              user?.email === 'doctor@checkhealth.com'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Stethoscope className="w-3 h-3" />
            Doctor (Dr. Sarah)
          </button>

          <button
            onClick={() => switchDemoUser('doctor2')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
              user?.email === 'ramesh.cardio@checkhealth.com'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Stethoscope className="w-3 h-3" />
            Doctor (Dr. Ramesh - Cardio)
          </button>

          <button
            onClick={() => switchDemoUser('admin')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
              user?.email === 'admin@checkhealth.com'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBar;
