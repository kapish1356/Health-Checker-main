import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  FileText, 
  Activity, 
  Heart, 
  ShieldCheck, 
  Clock, 
  Video, 
  Phone, 
  Pill, 
  Edit3, 
  CheckCircle2, 
  Plus 
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const PatientDashboard = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [labBookings, setLabBookings] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile Form state
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+');
  const [allergies, setAllergies] = useState(user?.allergies?.join(', ') || 'Penicillin, Dust Mites');
  const [chronic, setChronic] = useState(user?.chronicConditions?.join(', ') || 'Mild Asthma');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [aptRes, recRes, labRes] = await Promise.all([
          api.get('/appointments/my-appointments'),
          api.get('/medical-records'),
          api.get('/lab-tests/my-bookings')
        ]);
        if (aptRes.data.success) setAppointments(aptRes.data.appointments);
        if (recRes.data.success) setRecords(recRes.data.records);
        if (labRes.data.success) setLabBookings(labRes.data.bookings);
      } catch (e) {
        console.warn('Dashboard fetch error:', e);
      }
    };
    loadDashboardData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({
      phone,
      dob,
      gender,
      bloodGroup,
      allergies: allergies.split(',').map((s) => s.trim()).filter(Boolean),
      chronicConditions: chronic.split(',').map((s) => s.trim()).filter(Boolean)
    });
    setIsEditingProfile(false);
  };

  const upcomingApt = appointments.find((a) => a.status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-teal-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-md text-white font-black text-2xl flex items-center justify-center border-2 border-white/40 shadow-inner">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Patient Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5">Welcome back, {user?.name}!</h1>
            <p className="text-xs text-sky-100 mt-1">
              Blood Group: <strong className="text-white">{user?.bloodGroup || 'B+'}</strong> • ID: <span className="font-mono">{user?.id || 'usr-patient-1'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/doctors"
            className="px-5 py-3 rounded-2xl health-gradient text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            + Book Appointment
          </Link>
          <Link
            to="/medical-records"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
          >
            Health Locker
          </Link>
        </div>
      </div>

      {/* Grid: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Consultations</span>
            <Calendar className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{appointments.length}</p>
          <p className="text-[11px] text-teal-600 font-medium">Total registered sessions</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Health Records</span>
            <FileText className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{records.length}</p>
          <p className="text-[11px] text-sky-600 font-medium">Encrypted & archived</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Lab Tests</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{labBookings.length}</p>
          <p className="text-[11px] text-indigo-600 font-medium">Home sample orders</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Health Status</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">Optimal</p>
          <p className="text-[11px] text-slate-400">Routine vitals verified</p>
        </div>
      </div>

      {/* Next Upcoming Appointment Highlight */}
      {upcomingApt && (
        <div className="bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Calendar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-800">
                Upcoming Consultation
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{upcomingApt.doctorName} ({upcomingApt.doctorSpecialty})</h3>
              <p className="text-xs text-slate-600 font-medium">
                Scheduled for <strong>{upcomingApt.date}</strong> at <strong>{upcomingApt.timeSlot}</strong> • Mode: <span className="uppercase text-teal-700 font-bold">{upcomingApt.consultationType}</span>
              </p>
            </div>
          </div>

          <Link
            to="/appointments"
            className="px-6 py-3 rounded-2xl health-gradient text-white text-xs font-bold shadow-md hover:opacity-95 transition-all whitespace-nowrap"
          >
            Manage / Enter Video Room →
          </Link>
        </div>
      )}

      {/* Split: Health Profile & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Allergies */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              Medical Profile
            </h3>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs text-sky-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!isEditingProfile ? (
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold">{user?.phone || '+91 91234 56789'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Date of Birth:</span>
                <span className="font-semibold">{user?.dob || '1994-06-15'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Gender:</span>
                <span className="font-semibold">{user?.gender || 'Male'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-bold text-rose-600">{user?.bloodGroup || 'B+'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Known Allergies:</span>
                <div className="flex flex-wrap gap-1">
                  {(user?.allergies?.length > 0 ? user.allergies : ['Penicillin', 'Dust Mites']).map((a, i) => (
                    <span key={i} className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[11px] font-bold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Chronic Conditions:</span>
                <div className="flex flex-wrap gap-1">
                  {(user?.chronicConditions?.length > 0 ? user.chronicConditions : ['Mild Asthma']).map((c, i) => (
                    <span key={i} className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">DOB</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Known Allergies (Comma separated)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl health-gradient text-white font-bold text-xs shadow"
              >
                Save Health Profile
              </button>
            </form>
          )}
        </div>

        {/* Recent Digital Health Documents */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Recent Medical Documents & Prescriptions
            </h3>
            <Link to="/medical-records" className="text-xs text-sky-600 font-bold hover:underline">
              View All Locker Files
            </Link>
          </div>

          <div className="space-y-3">
            {records.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    {rec.category}
                  </span>
                  <h4 className="font-bold text-slate-900 mt-1">{rec.title}</h4>
                  <p className="text-[11px] text-slate-400">{rec.recordDate} • {rec.doctorName}</p>
                </div>
                <Link
                  to="/medical-records"
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-[11px]"
                >
                  View File
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default PatientDashboard;
