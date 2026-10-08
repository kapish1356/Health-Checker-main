import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Search, 
  FileText, 
  MessageSquare, 
  Send 
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'doctors' | 'users' | 'appointments' | 'audit' | 'support'
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, docRes, usrRes, aptRes, logsRes, tktRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/doctors'),
        api.get('/admin/users'),
        api.get('/admin/appointments'),
        api.get('/admin/audit-logs'),
        api.get('/admin/support-tickets')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (docRes.data.success) setDoctors(docRes.data.doctors);
      if (usrRes.data.success) setUsersList(usrRes.data.users);
      if (aptRes.data.success) setAppointments(aptRes.data.appointments);
      if (logsRes.data.success) setAuditLogs(logsRes.data.logs);
      if (tktRes.data.success) setTickets(tktRes.data.tickets);
    } catch (e) {
      console.warn('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDoctorVerification = async (docId) => {
    try {
      const res = await api.put(`/admin/doctors/${docId}/verify`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to update doctor verification');
    }
  };

  const handleReplyTicket = async (tktId) => {
    const text = replyText[tktId];
    if (!text || !text.trim()) {
      toast.warning('Please enter a response message.');
      return;
    }

    try {
      const res = await api.post(`/admin/support-tickets/${tktId}/reply`, { reply: text });
      if (res.data.success) {
        toast.success('Support reply submitted to patient.');
        setReplyText((prev) => ({ ...prev, [tktId]: '' }));
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to submit response');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Security & Administration</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">CheckHealth Admin Control Console</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Enforce doctor verification standards, review audit logs, and oversee consultations across India.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Platform Analytics', icon: Activity },
          { id: 'doctors', label: 'Doctor Verification & Licenses', icon: Stethoscope },
          { id: 'users', label: 'Registered Patients & Users', icon: Users },
          { id: 'appointments', label: 'All Consultations Master', icon: Calendar },
          { id: 'audit', label: 'HIPAA / DISHA Audit Logs', icon: ShieldAlert },
          { id: 'support', label: 'Support Inquiries', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview Analytics */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Patients</span>
              <p className="text-2xl font-black text-slate-900">{stats.totalPatients}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Doctors</span>
              <p className="text-2xl font-black text-teal-600">{stats.verifiedDoctors} / {stats.totalDoctors}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Consultations</span>
              <p className="text-2xl font-black text-sky-600">{stats.totalAppointments}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Platform Revenue</span>
              <p className="text-2xl font-black text-emerald-600">₹{stats.totalRevenue?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Doctor Credential Verification */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-base">Doctor Credential & Medical Council Verifications</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">MCI License Number</th>
                  <th className="p-3">Specialty & Degrees</th>
                  <th className="p-3">Hospital</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <img src={doc.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      {doc.name}
                    </td>
                    <td className="p-3 font-mono text-slate-600">{doc.licenseNumber || 'MCI/2012/55490'}</td>
                    <td className="p-3 text-slate-600">{doc.specialty} ({doc.qualifications})</td>
                    <td className="p-3 text-slate-500 truncate max-w-[180px]">{doc.hospital}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.isVerified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleDoctorVerification(doc.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          doc.isVerified
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {doc.isVerified ? 'Revoke Badge' : 'Approve & Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-base">Registered Users ({usersList.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{u.phone || '—'}</td>
                    <td className="p-3 text-slate-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Appointments Master */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-base">All Platform Consultations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Date & Slot</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-sky-600">{a.appointmentCode}</td>
                    <td className="p-3 text-slate-900 font-semibold">{a.patientName}</td>
                    <td className="p-3 text-slate-700">{a.doctorName}</td>
                    <td className="p-3 text-slate-600">{a.date} at {a.timeSlot}</td>
                    <td className="p-3 uppercase font-semibold text-[11px] text-teal-700">{a.consultationType}</td>
                    <td className="p-3 font-bold text-slate-900">₹{a.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        a.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-base">Security & Clinical Access Audit Trail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Action</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-rose-600">{log.action}</td>
                    <td className="p-3 text-slate-800">{log.userEmail}</td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Support Tickets */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-900 text-base">Patient Support Inquiries</h3>
          <div className="space-y-4">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">{tkt.userName} ({tkt.userEmail})</span>
                  <span className="text-sky-600 font-mono">{tkt.ticketNumber}</span>
                </div>
                <p className="font-semibold text-slate-800">{tkt.subject}</p>
                <p className="text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">{tkt.message}</p>
                
                {tkt.reply ? (
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-900">
                    <strong>Admin Reply:</strong> {tkt.reply}
                  </div>
                ) : (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Type response..."
                      value={replyText[tkt.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [tkt.id]: e.target.value })}
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-xs"
                    />
                    <button
                      onClick={() => handleReplyTicket(tkt.id)}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 text-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
