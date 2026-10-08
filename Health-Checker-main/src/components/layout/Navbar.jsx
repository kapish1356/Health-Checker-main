import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartPulse, 
  Search, 
  Calendar, 
  FileText, 
  Activity, 
  FlaskConical, 
  Pill, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  Stethoscope, 
  PhoneCall, 
  ChevronDown 
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Find Doctors', path: '/doctors', icon: Stethoscope },
    { name: 'Health Check', path: '/health-check', icon: Activity },
    { name: 'Lab Tests', path: '/lab-tests', icon: FlaskConical },
    { name: 'Medicines', path: '/medicines', icon: Pill },
    { name: 'My Appointments', path: '/appointments', icon: Calendar, requiresAuth: true },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, requiresAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl health-gradient flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                CheckHealth
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-teal-700 -mt-1">
                Care & Diagnostics
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'text-sky-700 bg-sky-50 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Emergency Hotline Button */}
            <Link
              to="/emergency"
              className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/70 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
              <span>24/7 Emergency</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-teal-400 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user?.name}
                    </p>
                    <span className="inline-block text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                    </div>

                    {role === 'patient' && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-sky-500" />
                        Patient Dashboard
                      </Link>
                    )}

                    {role === 'doctor' && (
                      <Link
                        to="/doctor/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <Stethoscope className="w-4 h-4 text-teal-600" />
                        Doctor Workspace
                      </Link>
                    )}

                    {role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-rose-600" />
                        Administrator Console
                      </Link>
                    )}

                    <Link
                      to="/appointments"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-sky-500" />
                      My Appointments
                    </Link>

                    <Link
                      to="/medical-records"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-sky-500" />
                      Digital Health Locker
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white health-gradient shadow-md shadow-sky-500/20 hover:opacity-95 hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 ${
                      isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 text-sky-500" />
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900">{user?.name} ({role})</p>
                </div>
                {role === 'patient' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Patient Dashboard
                  </Link>
                )}
                {role === 'doctor' && (
                  <Link
                    to="/doctor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Doctor Workspace
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl text-sm font-bold text-white health-gradient"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
