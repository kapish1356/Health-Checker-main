import { db } from '../models/db.js';

export const getAdminStats = (req, res) => {
  const totalUsers = db.data.users.length;
  const totalPatients = db.data.users.filter(u => u.role === 'patient').length;
  const totalDoctors = db.data.doctors.length;
  const verifiedDoctors = db.data.doctors.filter(d => d.isVerified).length;
  const totalAppointments = db.data.appointments.length;
  const completedAppointments = db.data.appointments.filter(a => a.status === 'completed').length;
  const totalLabBookings = (db.data.labBookings || []).length;
  
  const revenueAppointments = db.data.appointments
    .filter(a => a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const revenueLabs = (db.data.labBookings || [])
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  return res.json({
    success: true,
    stats: {
      totalUsers,
      totalPatients,
      totalDoctors,
      verifiedDoctors,
      pendingVerifications: totalDoctors - verifiedDoctors,
      totalAppointments,
      completedAppointments,
      totalLabBookings,
      totalRevenue: revenueAppointments + revenueLabs,
      activeSupportTickets: (db.data.supportTickets || []).filter(t => t.status === 'open').length
    }
  });
};

export const getAllUsers = (req, res) => {
  const users = db.data.users.map(({ password, ...u }) => u);
  return res.json({ success: true, users });
};

export const toggleDoctorVerification = (req, res) => {
  const { id } = req.params;
  const doctor = db.data.doctors.find(d => d.id === id);

  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found.' });
  }

  doctor.isVerified = !doctor.isVerified;
  db.save();
  db.logAudit('DOCTOR_VERIFICATION_TOGGLE', req.user.email, `Set verified=${doctor.isVerified} for ${doctor.name}`);

  return res.json({
    success: true,
    message: `Doctor verification status updated to: ${doctor.isVerified ? 'VERIFIED' : 'UNVERIFIED'}`,
    doctor
  });
};

export const getAllAppointmentsAdmin = (req, res) => {
  return res.json({
    success: true,
    appointments: db.data.appointments
  });
};

export const getAuditLogs = (req, res) => {
  return res.json({
    success: true,
    logs: db.data.auditLogs || []
  });
};

export const getSupportTickets = (req, res) => {
  return res.json({
    success: true,
    tickets: db.data.supportTickets || []
  });
};

export const replySupportTicket = (req, res) => {
  const { id } = req.params;
  const { reply, status = 'resolved' } = req.body;

  const ticket = (db.data.supportTickets || []).find(t => t.id === id);
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' });
  }

  ticket.reply = reply;
  ticket.status = status;
  ticket.repliedAt = new Date().toISOString();
  db.save();

  return res.json({
    success: true,
    message: 'Support ticket response saved.',
    ticket
  });
};
