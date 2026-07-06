const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUserStats,
} = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin', protect, authorize('admin'), getAdminStats);
router.get('/user', protect, getUserStats);

module.exports = router;
