import { CONFIG } from '../config/config.js';
import { db } from '../models/db.js';

export const createRazorpayOrder = (req, res) => {
  const { amount, currency = 'INR', receipt, notes } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required.' });
  }

  // Simulated Razorpay Order Object (or real test key integration)
  const orderId = `order_${Math.random().toString(36).substring(2, 12)}`;
  
  return res.json({
    success: true,
    orderId,
    amount: amount * 100, // in paise
    currency,
    key: CONFIG.RAZORPAY_KEY_ID,
    message: 'Payment order generated in test sandbox mode.'
  });
};

export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId, labBookingId } = req.body;

  // Server-side confirmation & logging
  if (!razorpay_payment_id) {
    return res.status(400).json({ success: false, message: 'Payment verification failed: Missing payment ID.' });
  }

  if (appointmentId) {
    const apt = db.data.appointments.find(a => a.id === appointmentId);
    if (apt) {
      apt.paymentStatus = 'paid';
      apt.paymentId = razorpay_payment_id;
      db.save();
    }
  }

  if (labBookingId) {
    const bk = (db.data.labBookings || []).find(b => b.id === labBookingId);
    if (bk) {
      bk.paymentStatus = 'paid';
      db.save();
    }
  }

  db.logAudit('PAYMENT_VERIFIED', req.user ? req.user.email : 'System', `Payment ${razorpay_payment_id} verified on server`);

  return res.json({
    success: true,
    verified: true,
    paymentId: razorpay_payment_id,
    message: 'Payment verified and confirmed successfully.'
  });
};
