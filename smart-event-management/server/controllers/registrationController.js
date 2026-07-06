const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');

exports.createRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Prevent registration for completed or cancelled events
    if (event.status === 'completed' || event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this event',
      });
    }

    const existingRegistration = await Registration.findOne({ userId, eventId });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No available seats for this event',
      });
    }

    const registration = await Registration.create({
      userId,
      eventId,
      registrationStatus: 'confirmed',
    });

    event.availableSeats -= 1;
    await event.save();

    // Create a pending attendance record so admin can mark it later
    const existingAttendance = await Attendance.findOne({ userId, eventId });
    if (!existingAttendance) {
      await Attendance.create({
        userId,
        eventId,
        attendanceStatus: 'pending',
      });
    }

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('userId', 'name email phone')
      .populate('eventId', 'title date venue');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      registration: populatedRegistration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const registration = await Registration.findOne({ userId, eventId });

    res.status(200).json({
      success: true,
      isRegistered: !!registration,
      registration: registration || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.eventId) {
      query.eventId = req.query.eventId;
    }

    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    if (req.query.status) {
      query.registrationStatus = req.query.status;
    }

    if (req.user.role === 'user') {
      query.userId = req.user._id;
    }

    const registrations = await Registration.find(query)
      .populate('userId', 'name email phone profileImage')
      .populate('eventId', 'title date venue startTime endTime image status')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Registration.countDocuments(query);

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    if (
      req.user.role === 'user' &&
      registration.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration',
      });
    }

    const event = await Event.findById(registration.eventId);
    if (event && registration.registrationStatus === 'confirmed') {
      event.availableSeats += 1;
      await event.save();
    }

    await Attendance.findOneAndDelete({
      userId: registration.userId,
      eventId: registration.eventId,
    });

    await registration.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
