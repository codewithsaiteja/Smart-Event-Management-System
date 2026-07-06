const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAllAttendance,
  updateAttendance,
  getAttendanceStats,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), markAttendance);
router.get('/', protect, getAllAttendance);
router.get('/stats', protect, authorize('admin'), getAttendanceStats);
router.put('/:id', protect, authorize('admin'), updateAttendance);

module.exports = router;
