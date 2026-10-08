import { db } from '../models/db.js';

export const checkSlotAvailability = (req, res) => {
  const { doctorId, date, timeSlot } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({ success: false, message: 'doctorId and date are required.' });
  }

  const doctor = db.data.doctors.find(d => d.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found.' });
  }

  const bookedAppointments = db.data.appointments.filter(
    a => a.doctorId === doctorId && a.date === date && a.status !== 'cancelled'
  );

  const bookedSlots = bookedAppointments.map(a => a.timeSlot);
  const availableSlots = (doctor.timeSlots || []).filter(s => !bookedSlots.includes(s));

  if (timeSlot) {
    const isAvailable = !bookedSlots.includes(timeSlot);
    return res.json({
      success: true,
      doctorId,
      date,
      timeSlot,
      isAvailable
    });
  }

  return res.json({
    success: true,
    doctorId,
    date,
    allSlots: doctor.timeSlots || [],
    bookedSlots,
    availableSlots
  });
};

export const createAppointment = (req, res) => {
  try {
    const { 
      doctorId, 
      date, 
      timeSlot, 
      consultationType = 'online', 
      symptomsNotes = '',
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      paymentMethod = 'online'
    } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Doctor, date, and time slot are required.' });
    }

    const doctor = db.data.doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // CONCURRENCY & DOUBLE-BOOKING CHECK
    const conflict = db.data.appointments.find(
      a => a.doctorId === doctorId && a.date === date && a.timeSlot === timeSlot && a.status !== 'cancelled'
    );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'This time slot was just booked by another patient. Please choose another slot.'
      });
    }

    const uniqueCode = `CHK-${Math.floor(10000 + Math.random() * 90000)}`;
    const fee = consultationType === 'online' ? (doctor.onlineFee || doctor.consultationFee) : doctor.consultationFee;

    const newAppointment = {
      id: `apt-${Date.now()}`,
      appointmentCode: uniqueCode,
      userId: req.user.id,
      patientName: patientName || req.user.name,
      patientAge: patientAge ? Number(patientAge) : 30,
      patientGender: patientGender || req.user.gender || 'Not Specified',
      patientPhone: patientPhone || req.user.phone || '',
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatar,
      consultationType,
      date,
      timeSlot,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'pay_at_clinic' ? 'pending' : 'paid',
      amount: fee,
      paymentId: paymentMethod === 'pay_at_clinic' ? null : `pay_sim_${Date.now()}`,
      symptomsNotes,
      meetingRoomId: consultationType === 'online' ? `room-${uniqueCode.toLowerCase()}` : null,
      createdAt: new Date().toISOString()
    };

    db.data.appointments.unshift(newAppointment);
    db.save();
    db.logAudit('APPOINTMENT_BOOKED', req.user.email, `Booked ${consultationType} consultation with ${doctor.name} for ${date} at ${timeSlot}`);

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ success: false, message: 'Failed to complete appointment booking.' });
  }
};

export const getMyAppointments = (req, res) => {
  const list = db.data.appointments.filter(a => a.userId === req.user.id);
  list.sort((a, b) => new Date(b.date + ' ' + (b.timeSlot || '')) - new Date(a.date + ' ' + (a.timeSlot || '')));
  return res.json({ success: true, appointments: list });
};

export const getDoctorAppointments = (req, res) => {
  const doctor = db.data.doctors.find(d => d.userId === req.user.id || d.name === req.user.name);
  if (!doctor && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized as a doctor.' });
  }

  const docId = doctor ? doctor.id : req.query.doctorId;
  const list = db.data.appointments.filter(a => a.doctorId === docId);
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return res.json({ success: true, appointments: list });
};

export const cancelAppointment = (req, res) => {
  const { id } = req.params;
  const { reason = 'Patient cancellation' } = req.body;

  const apt = db.data.appointments.find(a => a.id === id);
  if (!apt) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  // Auth check: patient who booked or the assigned doctor or admin
  const isOwner = apt.userId === req.user.id;
  const doc = db.data.doctors.find(d => d.id === apt.doctorId);
  const isDoctor = doc && (doc.userId === req.user.id || doc.name === req.user.name);
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isDoctor && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment.' });
  }

  apt.status = 'cancelled';
  apt.cancellationReason = reason;
  apt.cancelledAt = new Date().toISOString();
  if (apt.paymentStatus === 'paid') {
    apt.refundStatus = 'processed';
  }

  db.save();
  db.logAudit('APPOINTMENT_CANCELLED', req.user.email, `Appointment ${apt.appointmentCode} cancelled`);

  return res.json({
    success: true,
    message: 'Appointment has been cancelled and refund initiated.',
    appointment: apt
  });
};

export const rescheduleAppointment = (req, res) => {
  const { id } = req.params;
  const { date, timeSlot } = req.body;

  if (!date || !timeSlot) {
    return res.status(400).json({ success: false, message: 'New date and timeSlot required.' });
  }

  const apt = db.data.appointments.find(a => a.id === id);
  if (!apt) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  // Conflict check
  const conflict = db.data.appointments.find(
    a => a.id !== id && a.doctorId === apt.doctorId && a.date === date && a.timeSlot === timeSlot && a.status !== 'cancelled'
  );

  if (conflict) {
    return res.status(409).json({ success: false, message: 'Selected slot is already booked. Please select another slot.' });
  }

  apt.date = date;
  apt.timeSlot = timeSlot;
  apt.status = 'confirmed';
  apt.rescheduledAt = new Date().toISOString();

  db.save();
  db.logAudit('APPOINTMENT_RESCHEDULED', req.user.email, `Rescheduled ${apt.appointmentCode} to ${date} ${timeSlot}`);

  return res.json({
    success: true,
    message: 'Appointment rescheduled successfully.',
    appointment: apt
  });
};

export const completeConsultation = (req, res) => {
  const { id } = req.params;
  const { consultationSummary, medicines, doctorAdvice, followUpDate } = req.body;

  const apt = db.data.appointments.find(a => a.id === id);
  if (!apt) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  apt.status = 'completed';
  apt.consultationSummary = consultationSummary || 'Consultation completed successfully.';
  apt.completedAt = new Date().toISOString();

  // Create Prescription if medicines provided
  let newRx = null;
  if (medicines && medicines.length > 0) {
    newRx = {
      id: `rx-${Date.now()}`,
      appointmentId: apt.id,
      doctorId: apt.doctorId,
      doctorName: apt.doctorName,
      patientId: apt.userId,
      patientName: apt.patientName,
      date: apt.date,
      diagnosis: consultationSummary || 'General health consult',
      medicines,
      doctorAdvice: doctorAdvice || 'Take plenty of fluids and rest.',
      followUpDate: followUpDate || ''
    };
    db.data.prescriptions.unshift(newRx);

    // Also add to patient medical records
    db.data.medicalRecords.unshift({
      id: `rec-rx-${Date.now()}`,
      userId: apt.userId,
      title: `Prescription by ${apt.doctorName}`,
      category: 'Prescription',
      recordDate: apt.date,
      doctorName: apt.doctorName,
      hospitalName: 'CheckHealth Telehealth',
      fileName: `Prescription_${apt.appointmentCode}.pdf`,
      fileType: 'application/pdf',
      fileSize: '240 KB',
      fileUrl: '/uploads/sample_prescription.pdf',
      notes: consultationSummary || 'Prescription created during consultation',
      createdAt: new Date().toISOString()
    });
  }

  db.save();
  db.logAudit('CONSULTATION_COMPLETED', req.user.email, `Doctor completed consult ${apt.appointmentCode}`);

  return res.json({
    success: true,
    message: 'Consultation marked completed and prescription published.',
    appointment: apt,
    prescription: newRx
  });
};
