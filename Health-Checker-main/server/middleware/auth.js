import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/config.js';
import { db } from '../models/db.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No authorization token provided.' });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
    const user = db.data.users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token or user not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Requires one of [${roles.join(', ')}] privileges.` 
      });
    }
    next();
  };
};
