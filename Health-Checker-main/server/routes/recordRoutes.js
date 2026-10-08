import express from 'express';
import multer from 'multer';
import path from 'path';
import { CONFIG } from '../config/config.js';
import { getMyRecords, uploadRecord, deleteRecord, createShareLink } from '../controllers/recordController.js';
import { authenticateToken } from '../middleware/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CONFIG.UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `med_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.get('/', authenticateToken, getMyRecords);
router.post('/upload', authenticateToken, upload.single('file'), uploadRecord);
router.delete('/:id', authenticateToken, deleteRecord);
router.post('/share', authenticateToken, createShareLink);

export default router;
