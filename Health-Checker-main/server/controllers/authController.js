import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../models/db.js';
import { CONFIG } from '../config/config.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    CONFIG.JWT_SECRET,
    { expiresIn: CONFIG.JWT_EXPIRES_IN }
  );
};

export const register = (req, res) => {
  try {
    const { name, email, password, role = 'patient', phone, dob, gender, bloodGroup } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: ['patient', 'doctor', 'admin'].includes(role) ? role : 'patient',
      phone: phone || '',
      dob: dob || '',
      gender: gender || '',
      bloodGroup: bloodGroup || '',
      allergies: [],
      chronicConditions: [],
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newUser);
    db.save();
    db.logAudit('USER_REGISTER', newUser.email, `User registered with role ${newUser.role}`);

    const token = generateToken(newUser);
    const { password: _, ...userSafe } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userSafe
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    db.logAudit('USER_LOGIN', user.email, `Successful login for role ${user.role}`);
    const token = generateToken(user);
    const { password: _, ...userSafe } = user;

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userSafe
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

export const getMe = (req, res) => {
  const { password, ...userSafe } = req.user;
  
  // If doctor, also attach doctor profile
  let doctorProfile = null;
  if (req.user.role === 'doctor') {
    doctorProfile = db.data.doctors.find(d => d.userId === req.user.id || d.name === req.user.name);
  }

  return res.json({
    success: true,
    user: { ...userSafe, doctorProfile }
  });
};

export const updateProfile = (req, res) => {
  try {
    const userIndex = db.data.users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, phone, dob, gender, bloodGroup, allergies, chronicConditions, emergencyContact } = req.body;

    const user = db.data.users[userIndex];
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dob !== undefined) user.dob = dob;
    if (gender !== undefined) user.gender = gender;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (allergies !== undefined) user.allergies = allergies;
    if (chronicConditions !== undefined) user.chronicConditions = chronicConditions;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;

    db.data.users[userIndex] = user;
    db.save();
    db.logAudit('PROFILE_UPDATE', user.email, 'User updated health profile details');

    const { password: _, ...userSafe } = user;
    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: userSafe
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const resetPassword = (req, res) => {
  const { email, newPassword } = req.body;
  const user = db.data.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(404).json({ success: false, message: 'No registered user found with this email.' });
  }

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(newPassword || 'password123', salt);
  db.save();
  db.logAudit('PASSWORD_RESET', user.email, 'Password reset successfully');

  return res.json({ success: true, message: 'Password has been reset successfully. You can now login with your new credentials.' });
};
