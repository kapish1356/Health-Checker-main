import { db } from '../models/db.js';

export const getSpecialties = (req, res) => {
  return res.json({
    success: true,
    specialties: db.data.specialties || []
  });
};

export const getDoctors = (req, res) => {
  try {
    const { 
      search = '', 
      specialty = '', 
      maxFee, 
      minExp, 
      consultationType, 
      day, 
      sortBy = 'rating' 
    } = req.query;

    let list = [...db.data.doctors];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.clinicAddress.toLowerCase().includes(q) ||
        d.services.some(s => s.toLowerCase().includes(q))
      );
    }

    if (specialty && specialty !== 'all') {
      list = list.filter(d => 
        d.specialty.toLowerCase() === specialty.toLowerCase() || 
        d.specialtyId === specialty
      );
    }

    if (maxFee) {
      list = list.filter(d => d.consultationFee <= Number(maxFee));
    }

    if (minExp) {
      list = list.filter(d => d.experienceYears >= Number(minExp));
    }

    if (day && day !== 'all') {
      list = list.filter(d => d.availableDays.includes(day));
    }

    // Sort
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'experience') {
      list.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (sortBy === 'fee_low') {
      list.sort((a, b) => a.consultationFee - b.consultationFee);
    } else if (sortBy === 'fee_high') {
      list.sort((a, b) => b.consultationFee - a.consultationFee);
    }

    return res.json({
      success: true,
      total: list.length,
      doctors: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch doctors list.' });
  }
};

export const getDoctorById = (req, res) => {
  const { id } = req.params;
  const doctor = db.data.doctors.find(d => d.id === id);

  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found.' });
  }

  // Fetch verified reviews
  const reviews = db.data.reviews.filter(r => r.doctorId === id);

  // Check booked slots for today or requested date
  const date = req.query.date;
  let bookedSlots = [];
  if (date) {
    bookedSlots = db.data.appointments
      .filter(a => a.doctorId === id && a.date === date && a.status !== 'cancelled')
      .map(a => a.timeSlot);
  }

  return res.json({
    success: true,
    doctor: {
      ...doctor,
      reviews,
      bookedSlots
    }
  });
};

export const addDoctorReview = (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;
    if (!doctorId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Doctor ID, rating, and comment are required.' });
    }

    const doctor = db.data.doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      doctorId,
      userId: req.user.id,
      patientName: req.user.name,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    db.data.reviews.unshift(newReview);

    // Recalculate doctor rating
    const docReviews = db.data.reviews.filter(r => r.doctorId === doctorId);
    const avg = (docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length).toFixed(2);
    doctor.rating = parseFloat(avg);
    doctor.reviewCount = docReviews.length;

    db.save();
    db.logAudit('REVIEW_POSTED', req.user.email, `Submitted review for ${doctor.name}`);

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Review published.',
      review: newReview,
      updatedRating: doctor.rating
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to post review.' });
  }
};

export const updateDoctorProfile = (req, res) => {
  try {
    const doctorIndex = db.data.doctors.findIndex(d => d.userId === req.user.id || d.id === req.params.id);
    if (doctorIndex === -1) {
      return res.status(404).json({ success: false, message: 'Doctor record not found.' });
    }

    const { consultationFee, onlineFee, availableDays, timeSlots, about, clinicAddress, hospital } = req.body;
    const doc = db.data.doctors[doctorIndex];

    if (consultationFee !== undefined) doc.consultationFee = Number(consultationFee);
    if (onlineFee !== undefined) doc.onlineFee = Number(onlineFee);
    if (availableDays) doc.availableDays = availableDays;
    if (timeSlots) doc.timeSlots = timeSlots;
    if (about) doc.about = about;
    if (clinicAddress) doc.clinicAddress = clinicAddress;
    if (hospital) doc.hospital = hospital;

    db.data.doctors[doctorIndex] = doc;
    db.save();

    return res.json({
      success: true,
      message: 'Doctor profile and availability updated successfully.',
      doctor: doc
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update doctor profile.' });
  }
};
