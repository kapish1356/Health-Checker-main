import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { CONFIG } from './config/config.js';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import labRoutes from './routes/labRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads securely
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CheckHealth API Core',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-check', healthRoutes);
app.use('/api/lab-tests', labRoutes);
app.use('/api/medical-records', recordRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

const PORT = CONFIG.PORT;
app.listen(PORT, () => {
  console.log(`🚀 CheckHealth Backend Server running on http://localhost:${PORT}`);
});
