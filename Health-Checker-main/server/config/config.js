import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'check_your_health_super_secure_jwt_secret_2026',
  JWT_EXPIRES_IN: '7d',
  DATA_DIR: path.join(__dirname, '../data'),
  UPLOADS_DIR: path.join(__dirname, '../uploads'),
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_checkhealth2026',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'secret_checkhealth_2026'
};
