import express from 'express';
import { getSpecialties, getDoctors, getDoctorById, addDoctorReview, updateDoctorProfile } from '../controllers/doctorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/specialties', getSpecialties);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/reviews', authenticateToken, addDoctorReview);
router.put('/profile', authenticateToken, updateDoctorProfile);
router.put('/profile/:id', authenticateToken, updateDoctorProfile);

export default router;
