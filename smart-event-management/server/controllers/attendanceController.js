const Attendance = require('../models/Attendance');
const Event = require('../models/Event');

exports.markAttendance = async (req, res) => {
  try {
    const { userId, eventId, attendanceStatus } = req.body;

    // Check if event exists and get its date
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is today or in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate > today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark attendance for upcoming events',
      });
    }

    let attendance = await Attendance.findOne({ userId, eventId });

    if (!attendance) {
      attendance = await Attendance.create({
        userId,
        eventId,
        attendanceStatus,
        checkInTime: attendanceStatus === 'present' ? new Date() : null,
      });
    } else {
      attendance.attendanceStatus = attendanceStatus;
      attendance.checkInTime =
        attendanceStatus === 'present' ? new Date() : attendance.checkInTime;
      await attendance.save();
    }

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('userId', 'name email phone')
      .populate('eventId', 'title date venue');

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: populatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const isUser = req.user.role === 'user';

    // --- Build base MongoDB query ---
    const query = {};

    // Users only see their own records
    if (isUser) {
      query.userId = req.user._id;
    }

    // Admin: optional event filter
    if (req.query.eventId) {
      query.eventId = req.query.eventId;
    }

    // For admins: direct attendanceStatus filter (MongoDB level)
    // For users: we handle status filtering in-memory after computing eventTiming
    if (!isUser && req.query.status) {
      query.attendanceStatus = req.query.status;
    }

    // Fetch all matching records (no pagination yet — needed for in-memory filtering)
    const allRecords = await Attendance.find(query)
      .populate('userId', 'name email phone profileImage')
      .populate('eventId', 'title date venue startTime endTime')
      .sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Compute eventTiming for every record
    const recordsWithTiming = allRecords
      .filter(record => record.eventId) // skip orphaned records
      .map(record => {
        const eventDate = new Date(record.eventId.date);
        eventDate.setHours(0, 0, 0, 0);

        let eventTiming;
        if (eventDate.getTime() === today.getTime()) {
          eventTiming = 'today';
        } else if (eventDate < today) {
          eventTiming = 'past';
        } else {
          eventTiming = 'upcoming';
        }

        return { ...record.toObject(), eventTiming };
      });

    // --- Apply filtering ---
    let filtered;

    if (isUser) {
      // User filters are based on the EFFECTIVE display status, not raw attendanceStatus.
      // Effective status rules:
      //   upcoming event              → treated as "upcoming" regardless of attendanceStatus
      //   today/past + pending        → treated as "pending"
      //   today/past + present        → "present"
      //   today/past + absent         → "absent"
      const userStatusFilter = req.query.status || '';
      const dateFilter = req.query.filter || 'all';

      filtered = recordsWithTiming.filter(record => {
        const isUpcomingEvent = record.eventTiming === 'upcoming';
        const effectiveStatus = isUpcomingEvent ? 'upcoming' : record.attendanceStatus;

        // Apply date-based filter (admin-style tabs not used by user, but support 'all')
        if (dateFilter !== 'all') {
          if (dateFilter === 'upcoming' && record.eventTiming !== 'upcoming') return false;
          if (dateFilter === 'today' && record.eventTiming !== 'today') return false;
          if (dateFilter === 'past' && record.eventTiming !== 'past') return false;
        }

        // Apply status filter
        if (!userStatusFilter) return true; // "All" — show everything

        switch (userStatusFilter) {
          case 'present':
            // Only show records where event has passed/today AND admin marked present
            return effectiveStatus === 'present';
          case 'absent':
            // Only show records where event has passed/today AND admin marked absent
            return effectiveStatus === 'absent';
          case 'pending':
            // Show records that are pending or upcoming (not yet determined)
            return effectiveStatus === 'pending' || effectiveStatus === 'upcoming';
          default:
            return true;
        }
      });
    } else {
      // Admin: use date-based tab filter
      const dateFilter = req.query.filter || 'today';
      filtered = recordsWithTiming.filter(record => {
        switch (dateFilter) {
          case 'today':    return record.eventTiming === 'today';
          case 'past':     return record.eventTiming === 'past';
          case 'upcoming': return record.eventTiming === 'upcoming';
          case 'all':      return true;
          default:         return record.eventTiming === 'today';
        }
      });
    }

    // Apply pagination on the filtered result
    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      attendance: paginated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all attendance records with event details
    const allAttendance = await Attendance.find()
      .populate('eventId', 'date');

    // Separate by event timing
    const todayCount = allAttendance.filter(record => {
      if (!record.eventId) return false;
      const eventDate = new Date(record.eventId.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    }).length;

    const pastCount = allAttendance.filter(record => {
      if (!record.eventId) return false;
      const eventDate = new Date(record.eventId.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;
    }).length;

    const upcomingCount = allAttendance.filter(record => {
      if (!record.eventId) return false;
      const eventDate = new Date(record.eventId.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate > today;
    }).length;

    res.status(200).json({
      success: true,
      stats: {
        today: todayCount,
        past: pastCount,
        upcoming: upcomingCount,
        all: allAttendance.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { attendanceStatus } = req.body;

    const attendance = await Attendance.findById(req.params.id).populate('eventId', 'date');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    // Check if event is today or in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(attendance.eventId.date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate > today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark attendance for upcoming events',
      });
    }

    attendance.attendanceStatus = attendanceStatus;
    attendance.checkInTime =
      attendanceStatus === 'present' ? new Date() : attendance.checkInTime;

    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('userId', 'name email phone')
      .populate('eventId', 'title date venue');

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      attendance: populatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
