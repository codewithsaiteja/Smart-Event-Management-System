const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/profile', protect, getProfile);

router.put('/profile', protect, upload.single('profileImage'), updateProfile);

router.post('/logout', logout);

module.exports = router;
