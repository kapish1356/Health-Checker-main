import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import HomePage from './pages/Home/HomePage';
import DoctorsPage from './pages/Doctors/DoctorsPage';
import DoctorDetailPage from './pages/Doctors/DoctorDetailPage';
import HealthCheckPage from './pages/HealthCheck/HealthCheckPage';
import LabTestsPage from './pages/LabTests/LabTestsPage';
import MedicinesPage from './pages/Medicines/MedicinesPage';
import MyAppointmentsPage from './pages/Appointments/MyAppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecords/MedicalRecordsPage';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import EmergencyPage from './pages/Emergency/EmergencyPage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Route scroll reset & Floating Back to Top */}
      <ScrollToTop />
      
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/health-check" element={<HealthCheckPage />} />
          <Route path="/lab-tests" element={<LabTestsPage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Patient Routes */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                <MyAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records"
            element={
              <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                <MedicalRecordsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
