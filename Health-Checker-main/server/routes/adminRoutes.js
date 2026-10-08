import express from 'express';
import { 
  getAdminStats, 
  getAllUsers, 
  toggleDoctorVerification, 
  getAllAppointmentsAdmin, 
  getAuditLogs, 
  getSupportTickets, 
  replySupportTicket 
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/doctors/:id/verify', toggleDoctorVerification);
router.get('/appointments', getAllAppointmentsAdmin);
router.get('/audit-logs', getAuditLogs);
router.get('/support-tickets', getSupportTickets);
router.post('/support-tickets/:id/reply', replySupportTicket);

export default router;
