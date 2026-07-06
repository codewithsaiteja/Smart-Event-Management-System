const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    
    // Only count attendance from past and today's events
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allAttendance = await Attendance.find({ attendanceStatus: 'present' })
      .populate('eventId', 'date');

    // Filter only past and today's events
    const totalAttendance = allAttendance.filter(record => {
      if (!record.eventId) return false;
      const eventDate = new Date(record.eventId.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate <= today;
    }).length;

    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      status: 'upcoming',
    })
      .sort({ date: 1 })
      .limit(5);

    const recentRegistrations = await Registration.find()
      .populate('userId', 'name email')
      .populate('eventId', 'title date')
      .sort({ createdAt: -1 })
      .limit(5);

    const monthlyEvents = await Event.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthlyRegistrations = await Registration.aggregate([
      {
        $group: {
          _id: { $month: '$registrationDate' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalAttendance,
        upcomingEvents,
        recentRegistrations,
        monthlyEvents,
        monthlyRegistrations,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const registeredEvents = await Registration.countDocuments({
      userId,
      registrationStatus: 'confirmed',
    });

    const upcomingEvents = await Registration.find({
      userId,
      registrationStatus: 'confirmed',
    })
      .populate({
        path: 'eventId',
        match: { date: { $gte: new Date() }, status: 'upcoming' },
      })
      .sort({ createdAt: -1 });

    const filteredUpcoming = upcomingEvents.filter(
      (reg) => reg.eventId !== null
    );

    const attendanceRecords = await Attendance.find({ userId })
      .populate('eventId', 'title date venue')
      .sort({ createdAt: -1 })
      .limit(5);

    const attendanceStats = await Attendance.aggregate([
      {
        $match: { userId: req.user._id },
      },
      {
        $group: {
          _id: '$attendanceStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        registeredEvents,
        upcomingEventsCount: filteredUpcoming.length,
        upcomingEvents: filteredUpcoming,
        attendanceRecords,
        attendanceStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
