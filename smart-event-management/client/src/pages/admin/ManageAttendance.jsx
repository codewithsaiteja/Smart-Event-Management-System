import { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarDay, FaHistory, FaCalendarAlt, FaList } from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

const ManageAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [activeFilter, setActiveFilter] = useState('today');
  const [stats, setStats] = useState({ today: 0, past: 0, upcoming: 0, all: 0 });

  useEffect(() => {
    fetchEvents();
    fetchAttendanceStats();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [currentPage, selectedEvent, activeFilter]);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents({ limit: 100 });
      setEvents(response.events);
    } catch (error) {
      console.error('Failed to fetch events');
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      const response = await attendanceService.getAttendanceStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = { 
        page: currentPage, 
        limit: 10,
        filter: activeFilter 
      };
      if (selectedEvent) params.eventId = selectedEvent;

      const response = await attendanceService.getAllAttendance(params);
      setAttendance(response.attendance);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (userId, eventId, status) => {
    try {
      await attendanceService.markAttendance({
        userId,
        eventId,
        attendanceStatus: status,
      });
      toast.success('Attendance marked successfully');
      fetchAttendance();
      fetchAttendanceStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleUpdateAttendance = async (id, status) => {
    try {
      await attendanceService.updateAttendance(id, { attendanceStatus: status });
      toast.success('Attendance updated successfully');
      fetchAttendance();
      fetchAttendanceStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update attendance');
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getTimingBadge = (timing) => {
    const badges = {
      today: { bg: 'bg-blue-100 text-blue-800', icon: FaCalendarDay, text: 'Today' },
      past: { bg: 'bg-gray-100 text-gray-800', icon: FaHistory, text: 'Past' },
      upcoming: { bg: 'bg-yellow-100 text-yellow-800', icon: FaCalendarAlt, text: 'Upcoming' },
    };
    return badges[timing] || badges.upcoming;
  };

  const canMarkAttendance = (timing) => {
    return timing === 'today' || timing === 'past';
  };

  if (loading && attendance.length === 0) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Attendance</h1>
        <p className="text-gray-600">Mark and manage attendance for events</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleFilterChange('today')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCalendarDay />
            <span>Today's Events</span>
            <span className="bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
              {stats.today}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange('past')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'past'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaHistory />
            <span>Past Events</span>
            <span className="bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
              {stats.past}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange('upcoming')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'upcoming'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCalendarAlt />
            <span>Upcoming Events</span>
            <span className="bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
              {stats.upcoming}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaList />
            <span>All Events</span>
            <span className="bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
              {stats.all}
            </span>
          </button>
        </div>
      </div>

      {/* Event Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Event (Optional)
        </label>
        <select
          value={selectedEvent}
          onChange={(e) => {
            setSelectedEvent(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field max-w-md"
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title} - {formatDate(event.date)}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Table */}
      {attendance.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Timing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.map((record) => {
                    const timingBadge = getTimingBadge(record.eventTiming);
                    const TimingIcon = timingBadge.icon;
                    const canMark = canMarkAttendance(record.eventTiming);

                    return (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.userId?.name}
                          </div>
                          <div className="text-sm text-gray-500">{record.userId?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.eventId?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record.eventId?.date && formatDate(record.eventId.date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.eventId?.startTime} - {record.eventId?.endTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${timingBadge.bg}`}>
                            <TimingIcon />
                            <span>{timingBadge.text}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                record.attendanceStatus
                              )}`}
                            >
                              {record.attendanceStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.eventTiming === 'upcoming' ? (
                            <div className="text-sm text-gray-500 italic">
                              Attendance not available yet
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  record.attendanceStatus === 'pending'
                                    ? handleMarkAttendance(
                                        record.userId._id,
                                        record.eventId._id,
                                        'present'
                                      )
                                    : handleUpdateAttendance(record._id, 'present')
                                }
                                disabled={!canMark}
                                className={`p-2 rounded-lg transition-colors ${
                                  canMark
                                    ? 'text-green-600 hover:bg-green-50'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                                title={canMark ? 'Mark Present' : 'Cannot mark attendance'}
                              >
                                <FaCheckCircle size={20} />
                              </button>
                              <button
                                onClick={() =>
                                  record.attendanceStatus === 'pending'
                                    ? handleMarkAttendance(
                                        record.userId._id,
                                        record.eventId._id,
                                        'absent'
                                      )
                                    : handleUpdateAttendance(record._id, 'absent')
                                }
                                disabled={!canMark}
                                className={`p-2 rounded-lg transition-colors ${
                                  canMark
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                                title={canMark ? 'Mark Absent' : 'Cannot mark attendance'}
                              >
                                <FaTimesCircle size={20} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FaClock className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600 text-lg mb-2">No attendance records found</p>
          <p className="text-gray-500 text-sm">
            {activeFilter === 'today' && 'No events scheduled for today'}
            {activeFilter === 'past' && 'No past events with attendance records'}
            {activeFilter === 'upcoming' && 'No upcoming events with registrations'}
            {activeFilter === 'all' && 'No attendance records available'}
          </p>
        </div>
      )}

      {/* Info Banner for Upcoming Events */}
      {activeFilter === 'upcoming' && attendance.length > 0 && (
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCalendarAlt className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Attendance can only be marked on or after the event date. 
                These are upcoming events with registered participants.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAttendance;
