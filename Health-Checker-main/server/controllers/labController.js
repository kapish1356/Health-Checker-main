import { db } from '../models/db.js';

export const getLabCatalog = (req, res) => {
  const { category, search } = req.query;
  let packages = [...(db.data.labPackages || [])];
  let tests = [...(db.data.labTests || [])];

  if (category && category !== 'all') {
    packages = packages.filter(p => p.category.toLowerCase() === category.toLowerCase());
    tests = tests.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    packages = packages.filter(p => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q));
    tests = tests.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }

  return res.json({
    success: true,
    packages,
    tests
  });
};

export const getPackageById = (req, res) => {
  const { id } = req.params;
  const pkg = db.data.labPackages.find(p => p.id === id);
  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Lab package not found.' });
  }
  return res.json({ success: true, package: pkg });
};

export const bookLabTest = (req, res) => {
  try {
    const { 
      packageId, 
      testId, 
      collectionType = 'home', 
      address, 
      date, 
      timeSlot,
      patientName,
      patientPhone 
    } = req.body;

    let itemName = 'Standard Health Test';
    let amount = 999;

    if (packageId) {
      const pkg = db.data.labPackages.find(p => p.id === packageId);
      if (pkg) {
        itemName = pkg.title;
        amount = pkg.discountPrice || pkg.originalPrice;
      }
    } else if (testId) {
      const t = db.data.labTests.find(item => item.id === testId);
      if (t) {
        itemName = t.name;
        amount = t.price;
      }
    }

    const bookingCode = `LAB-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking = {
      id: `lab-bk-${Date.now()}`,
      bookingCode,
      userId: req.user.id,
      patientName: patientName || req.user.name,
      patientPhone: patientPhone || req.user.phone || '',
      packageId: packageId || null,
      testId: testId || null,
      packageName: itemName,
      collectionType,
      address: collectionType === 'home' ? (address || 'Primary Patient Address') : 'Apollo Diagnostics City Hub, Centre 1',
      date: date || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || '08:00 AM - 09:00 AM',
      amount,
      paymentStatus: 'paid',
      status: 'sample_scheduled',
      phlebotomistName: collectionType === 'home' ? 'Designated Certified Phlebotomist' : 'Lab Diagnostic Center',
      createdAt: new Date().toISOString()
    };

    if (!db.data.labBookings) db.data.labBookings = [];
    db.data.labBookings.unshift(newBooking);
    db.save();
    db.logAudit('LAB_BOOKING_CREATED', req.user.email, `Booked lab package ${bookingCode}: ${itemName}`);

    return res.status(201).json({
      success: true,
      message: 'Lab appointment booked successfully!',
      booking: newBooking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to book lab test.' });
  }
};

export const getMyLabBookings = (req, res) => {
  const list = (db.data.labBookings || []).filter(b => b.userId === req.user.id);
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return res.json({ success: true, bookings: list });
};
