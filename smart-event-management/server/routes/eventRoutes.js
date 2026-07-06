const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('startTime').trim().notEmpty().withMessage('Start time is required'),
    body('endTime').trim().notEmpty().withMessage('End time is required'),
    body('organizer').trim().notEmpty().withMessage('Organizer is required'),
    body('capacity')
      .isInt({ min: 1 })
      .withMessage('Capacity must be at least 1'),
  ],
  createEvent
);

router.get('/', getAllEvents);

router.get('/:id', getEventById);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('image'),
  updateEvent
);

router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;
