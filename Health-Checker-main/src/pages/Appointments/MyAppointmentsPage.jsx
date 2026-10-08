import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  FileText, 
  Download, 
  User, 
  Stethoscope 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/common/EmptyState';
import VideoCallRoom from '../../components/common/VideoCallRoom';

const MyAppointmentsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoAppointment, setActiveVideoAppointment] = useState(null);

  // Reschedule state
  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments/my-appointments');
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (e) {
      console.warn('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const reason = window.prompt('Please enter the reason for cancellation (Refund will be processed instantly):', 'Schedule conflict');
    if (reason === null) return;

    try {
      const res = await api.post(`/appointments/${id}/cancel`, { reason });
      if (res.data.success) {
        toast.success('Appointment cancelled. Refund initiated to original payment source.');
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel appointment');
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleApt || !newDate || !newSlot) {
      toast.warning('Please select date and slot');
      return;
    }

    try {
      const res = await api.post(`/appointments/${rescheduleApt.id}/reschedule`, {
        date: newDate,
        timeSlot: newSlot
      });
      if (res.data.success) {
        toast.success('Appointment rescheduled successfully.');
        setRescheduleApt(null);
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.message || 'Slot conflict. Please choose another slot.');
    }
  };

  const downloadPrescription = (apt) => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(2, 132, 199);
      doc.text('CheckHealth Telehealth Network', 20, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Official Digital Consultation Summary & Prescription', 20, 28);
      doc.line(20, 32, 190, 32);

      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`Doctor: ${apt.doctorName}`, 20, 42);
      doc.text(`Specialty: ${apt.doctorSpecialty}`, 20, 48);
      doc.text(`Date: ${apt.date}`, 20, 54);

      doc.text(`Patient: ${apt.patientName}`, 120, 42);
      doc.text(`Code: ${apt.appointmentCode}`, 120, 48);
      doc.text(`Status: COMPLETED`, 120, 54);

      doc.line(20, 60, 190, 60);

      doc.text('Consultation Summary & Notes:', 20, 72);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(apt.consultationSummary || apt.symptomsNotes || 'Consultation completed successfully.', 20, 80, { maxWidth: 170 });

      doc.save(`Prescription_${apt.appointmentCode}.pdf`);
      toast.success('Downloaded official consultation record PDF');
    } catch (e) {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Patient Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">My Medical Consultations</h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            Track upcoming clinic & video appointments, launch live consultations, and download prescriptions.
          </p>
        </div>

        <Link
          to="/doctors"
          className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all"
        >
          <Calendar className="w-4 h-4 text-sky-600" />
          Book New Consultation
        </Link>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-28 bg-slate-100 rounded-3xl animate-pulse"></div>
          <div className="h-28 bg-slate-100 rounded-3xl animate-pulse"></div>
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments booked yet"
          description="Schedule a video consult with a specialist or book an in-person hospital appointment."
          actionText="Find & Book Doctor"
          actionLink="/doctors"
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={apt.doctorAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                  alt={apt.doctorName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{apt.doctorName}</h3>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-teal-600 font-semibold">{apt.doctorSpecialty}</p>
                  
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-sky-500" />
                      {apt.date} at {apt.timeSlot}
                    </span>
                    <span className="flex items-center gap-1 uppercase font-semibold text-slate-500">
                      {apt.consultationType === 'online' ? <Video className="w-3.5 h-3.5 text-sky-500" /> : <Building2 className="w-3.5 h-3.5 text-teal-500" />}
                      {apt.consultationType}
                    </span>
                    <span className="font-mono text-slate-400">ID: {apt.appointmentCode}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full md:w-auto flex flex-wrap items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0">
                {apt.status === 'confirmed' && apt.consultationType === 'online' && (
                  <button
                    onClick={() => setActiveVideoAppointment(apt)}
                    className="px-5 py-2.5 rounded-xl health-gradient text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-4 h-4 animate-pulse" />
                    Enter Live Video Room
                  </button>
                )}

                {apt.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => {
                        setRescheduleApt(apt);
                        setNewDate(apt.date);
                        setNewSlot(apt.timeSlot);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {apt.status === 'completed' && (
                  <button
                    onClick={() => downloadPrescription(apt)}
                    className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Prescription PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Reschedule Appointment</h3>
            <p className="text-slate-500">With {rescheduleApt.doctorName}</p>

            <form onSubmit={handleReschedule} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-white"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="06:30 PM">06:30 PM</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl health-gradient text-white font-bold"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Video Telehealth Consultation Room */}
      {activeVideoAppointment && (
        <VideoCallRoom
          appointment={activeVideoAppointment}
          onEndCall={() => {
            setActiveVideoAppointment(null);
            fetchAppointments();
          }}
        />
      )}

    </div>
  );
};

export default MyAppointmentsPage;
