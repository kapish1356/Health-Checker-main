import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('checkhealth_token');
      const savedUser = localStorage.getItem('checkhealth_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('checkhealth_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, resetting token.');
          localStorage.removeItem('checkhealth_token');
          localStorage.removeItem('checkhealth_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('checkhealth_token', res.data.token);
        localStorage.setItem('checkhealth_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`, 'Logged In');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      toast.error(err.message || 'Login failed', 'Authentication Error');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('checkhealth_token', res.data.token);
        localStorage.setItem('checkhealth_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success('Your account was created successfully!', 'Welcome to CheckHealth');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed', 'Registration Error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('checkhealth_token');
    localStorage.removeItem('checkhealth_user');
    setUser(null);
    toast.info('You have been logged out securely.', 'Logged Out');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('checkhealth_user', JSON.stringify(res.data.user));
        toast.success('Health profile updated successfully.', 'Profile Saved');
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.', 'Error');
      return { success: false, message: err.message };
    }
  };

  const switchDemoUser = async (roleType) => {
    let email = 'patient@checkhealth.com';
    if (roleType === 'doctor') email = 'doctor@checkhealth.com';
    else if (roleType === 'doctor2') email = 'ramesh.cardio@checkhealth.com';
    else if (roleType === 'admin') email = 'admin@checkhealth.com';

    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role || 'guest',
        login,
        register,
        logout,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
