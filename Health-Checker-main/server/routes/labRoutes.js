import express from 'express';
import { getLabCatalog, getPackageById, bookLabTest, getMyLabBookings } from '../controllers/labController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getLabCatalog);
router.get('/package/:id', getPackageById);
router.post('/book', authenticateToken, bookLabTest);
router.get('/my-bookings', authenticateToken, getMyLabBookings);

export default router;
