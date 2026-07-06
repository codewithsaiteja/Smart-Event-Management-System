import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import { formatDate } from '../../utils/formatDate';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaArrowLeft,
  FaHourglassHalf,
} from 'react-icons/fa';

// Filters the user can pick — maps directly to the ?status= query param
const STATUS_FILTERS = [
  { value: '',        label: 'All'     },
  { value: 'present', label: 'Present' },
  { value: 'absent',  label: 'Absent'  },
  { value: 'pending', label: 'Pending' }, // backend returns pending + upcoming here
];

const Attendance = () => {
  const [attendance, setAttendance]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page:   currentPage,
        limit:  10,
        filter: 'all',          // date-based pass-through — user filter is status-based
      };
      if (statusFilter) params.status = statusFilter;

      const response = await attendanceService.getAllAttendance(params);
      setAttendance(response.attendance  || []);
      setTotalPages(response.totalPages  || 1);
      setTotalRecords(response.total     || 0);
    } catch {
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  /* ---------- helpers ---------- */

  /**
   * Compute the effective display status from eventTiming + attendanceStatus.
   *  - upcoming event  → "upcoming"  (overrides whatever is stored)
   *  - else            → use attendanceStatus as-is
   */
  const effectiveStatus = (record) =>
    record.eventTiming === 'upcoming' ? 'upcoming' : record.attendanceStatus;

  const renderStatusBadge = (record) => {
    const status = effectiveStatus(record);
    switch (status) {
      case 'present':
        return (
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-600 flex-shrink-0" />
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Present
            </span>
          </div>
        );
      case 'absent':
        return (
          <div className="flex items-center gap-2">
            <FaTimesCircle className="text-red-500 flex-shrink-0" />
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              Absent
            </span>
          </div>
        );
      case 'upcoming':
        return (
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-yellow-500 flex-shrink-0" />
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              Upcoming
            </span>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="flex items-center gap-2">
            <FaHourglassHalf className="text-orange-400 flex-shrink-0" />
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              Pending
            </span>
          </div>
        );
    }
  };

  const renderCheckInCell = (record) => {
    const status = effectiveStatus(record);
    if (status === 'upcoming') {
      return (
        <span className="text-xs text-yellow-600 italic">
          Attendance available after event date
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="text-xs text-orange-500 italic">
          Waiting for admin to mark attendance
        </span>
      );
    }
    if (status === 'present' && record.checkInTime) {
      return (
        <span className="text-sm text-gray-700">
          {new Date(record.checkInTime).toLocaleString()}
        </span>
      );
    }
    return <span className="text-sm text-gray-400">—</span>;
  };

  /* ---------- render ---------- */

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
        <p className="text-gray-500 mt-1">Track your attendance across all registered events</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500 mr-1">Filter:</span>
          {STATUS_FILTERS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === opt.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
          {totalRecords > 0 && (
            <span className="ml-auto text-sm text-gray-400">
              {totalRecords} record{totalRecords !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {attendance.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Check-in Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendance.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {record.eventId?.title}
                        </div>
                        {record.eventId?.startTime && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {record.eventId.startTime}
                            {record.eventId.endTime && ` – ${record.eventId.endTime}`}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {record.eventId?.date && formatDate(record.eventId.date)}
                        </div>
                        {record.eventTiming === 'today' && (
                          <span className="text-xs font-medium text-blue-600">Today</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{record.eventId?.venue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(record)}
                      </td>
                      <td className="px-6 py-4">
                        {renderCheckInCell(record)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium mb-1">No records found</p>
          <p className="text-gray-400 text-sm mb-6">
            {statusFilter
              ? `No ${statusFilter} attendance records`
              : 'Register for events to start tracking your attendance'}
          </p>
          {!statusFilter && (
            <Link to="/events" className="btn-primary inline-block">
              Browse Events
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
