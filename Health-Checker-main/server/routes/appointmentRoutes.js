import express from 'express';
import { 
  checkSlotAvailability, 
  createAppointment, 
  getMyAppointments, 
  getDoctorAppointments, 
  cancelAppointment, 
  rescheduleAppointment, 
  completeConsultation 
} from '../controllers/appointmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/check-slots', checkSlotAvailability);
router.post('/book', authenticateToken, createAppointment);
router.get('/my-appointments', authenticateToken, getMyAppointments);
router.get('/doctor-appointments', authenticateToken, getDoctorAppointments);
router.post('/:id/cancel', authenticateToken, cancelAppointment);
router.post('/:id/reschedule', authenticateToken, rescheduleAppointment);
router.post('/:id/complete', authenticateToken, completeConsultation);

export default router;
