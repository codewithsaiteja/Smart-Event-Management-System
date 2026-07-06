const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getAllRegistrations,
  deleteRegistration,
  checkRegistration,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRegistration);
router.get('/', protect, getAllRegistrations);
router.get('/check/:eventId', protect, checkRegistration);
router.delete('/:id', protect, deleteRegistration);

module.exports = router;
