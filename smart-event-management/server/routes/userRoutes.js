const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
