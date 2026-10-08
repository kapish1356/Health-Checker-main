import express from 'express';
import { analyzeSymptoms, calculateHealthMetrics } from '../controllers/healthController.js';

const router = express.Router();

router.post('/symptom-check', analyzeSymptoms);
router.post('/calculate', calculateHealthMetrics);

export default router;
