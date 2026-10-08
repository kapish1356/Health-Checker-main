import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Video, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Edit3, 
  Save 
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import VideoCallRoom from '../../components/common/VideoCallRoom';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCallApt, setActiveCallApt] = useState(null);

  // Edit Doctor Schedule & Fee State
  const [consultationFee, setConsultationFee] = useState(650);
  const [onlineFee, setOnlineFee] = useState(500);
  const [clinicAddress, setClinicAddress] = useState('');
  const [about, setAbout] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const [docRes, aptRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/appointments/doctor-appointments')
      ]);

      if (docRes.data.success) {
        const myDoc = docRes.data.doctors.find((d) => d.userId === user?.id || d.name === user?.name) || docRes.data.doctors[0];
        setDoctorProfile(myDoc);
        setConsultationFee(myDoc.consultationFee);
        setOnlineFee(myDoc.onlineFee || 500);
        setClinicAddress(myDoc.clinicAddress || '');
        setAbout(myDoc.about || '');
      }

      if (aptRes.data.success) {
        setAppointments(aptRes.data.appointments);
      }
    } catch (e) {
      console.warn('Failed to load doctor dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDoctorSettings = async (e) => {
    e.preventDefault();
    if (!doctorProfile) return;
    try {
      const res = await api.put('/doctors/profile', {
        consultationFee: Number(consultationFee),
        onlineFee: Number(onlineFee),
        clinicAddress,
        about
      });
      if (res.data.success) {
        toast.success('Doctor schedule & consultation fee settings updated.');
        setIsEditing(false);
        fetchDoctorData();
      }
    } catch (err) {
      toast.error('Failed to update doctor profile');
    }
  };

  const totalEarnings = appointments
    .filter((a) => a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const pendingCount = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-sky-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={doctorProfile?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
            alt="Doctor"
            className="w-20 h-20 rounded-3xl object-cover border-2 border-teal-300/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Doctor Clinical Suite</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Practitioner
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">{doctorProfile?.name || user?.name}</h1>
            <p className="text-xs text-slate-300 font-medium">
              {doctorProfile?.qualifications} • {doctorProfile?.specialty} • {doctorProfile?.hospital}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Close Settings' : 'Fee & Schedule Settings'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Upcoming Patients</span>
          <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
          <p className="text-[11px] text-sky-600 font-medium">Awaiting consultation today</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Completed Consults</span>
          <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
          <p className="text-[11px] text-slate-400">Prescriptions issued</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue Earned</span>
          <p className="text-2xl font-black text-slate-900">₹{totalEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-teal-600 font-medium">Disbursed automatically</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Patient Rating</span>
          <p className="text-2xl font-black text-amber-500">★ {doctorProfile?.rating || '4.9'}</p>
          <p className="text-[11px] text-slate-400">{doctorProfile?.reviewCount || 340}+ authentic reviews</p>
        </div>
      </div>

      {/* Settings Panel if toggled */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500 shadow-lg space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-teal-600" />
            Manage Consultation Fees & Clinical Profile
          </h3>

          <form onSubmit={handleUpdateDoctorSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">In-Person Consultation Fee (₹)</label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Online Telehealth Video Fee (₹)</label>
              <input
                type="number"
                value={onlineFee}
                onChange={(e) => setOnlineFee(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Clinic Address & Chamber</label>
              <input
                type="text"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Physician Bio & Background</label>
              <textarea
                rows={2}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl health-gradient text-white font-bold flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patient Appointments Schedule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Scheduled Patient Appointments</h3>
            <p className="text-xs text-slate-500">Access authorized patient data and initiate live video calls</p>
          </div>
        </div>

        {appointments.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No patient appointments scheduled for today.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{apt.patientName}</h4>
                    <span className="text-[11px] text-slate-500">
                      ({apt.patientAge || '31'} yrs, {apt.patientGender || 'Male'})
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Slot: <strong className="text-slate-800">{apt.date} at {apt.timeSlot}</strong> • Mode: <span className="uppercase font-bold text-teal-700">{apt.consultationType}</span> • Contact: {apt.patientPhone}
                  </p>

                  {apt.symptomsNotes && (
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      Patient Notes: "{apt.symptomsNotes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {apt.status === 'confirmed' && apt.consultationType === 'online' && (
                    <button
                      onClick={() => setActiveCallApt(apt)}
                      className="px-5 py-2.5 rounded-xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-4 h-4 animate-pulse" />
                      Start Video Call & Rx
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Telehealth Room if active */}
      {activeCallApt && (
        <VideoCallRoom
          appointment={activeCallApt}
          onEndCall={() => {
            setActiveCallApt(null);
            fetchDoctorData();
          }}
        />
      )}

    </div>
  );
};

export default DoctorDashboard;
