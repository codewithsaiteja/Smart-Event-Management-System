import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsService } from '../../services/statsService';
import { FaCalendarCheck, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsService.getUserStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Registered Events"
          value={stats?.registeredEvents || 0}
          icon={FaCalendarCheck}
          color="primary"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEventsCount || 0}
          icon={FaCalendarAlt}
          color="green"
        />
        <StatCard
          title="Attended"
          value={stats?.attendanceStats?.find(s => s._id === 'present')?.count || 0}
          icon={FaCheckCircle}
          color="purple"
        />
        <StatCard
          title="Pending"
          value={stats?.attendanceStats?.find(s => s._id === 'pending')?.count || 0}
          icon={FaClock}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
          {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingEvents.slice(0, 3).map((registration) => (
                registration.eventId && (
                  <div key={registration._id} className="border-l-4 border-primary-600 pl-4">
                    <Link
                      to={`/events/${registration.eventId._id}`}
                      className="text-lg font-semibold text-gray-800 hover:text-primary-600"
                    >
                      {registration.eventId.title}
                    </Link>
                    <p className="text-sm text-gray-600">
                      {new Date(registration.eventId.date).toLocaleDateString()} at {registration.eventId.startTime}
                    </p>
                    <p className="text-sm text-gray-600">{registration.eventId.venue}</p>
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming events</p>
          )}
          <Link to="/my-registrations" className="block mt-4 text-primary-600 hover:text-primary-700 font-semibold">
            View All Registrations →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Attendance</h2>
          {stats?.attendanceRecords && stats.attendanceRecords.length > 0 ? (
            <div className="space-y-4">
              {stats.attendanceRecords.map((attendance) => {
                const eventDate = attendance.eventId?.date
                  ? new Date(attendance.eventId.date)
                  : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isUpcoming = eventDate && eventDate > today;

                return (
                  <div key={attendance._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{attendance.eventId?.title}</p>
                      <p className="text-sm text-gray-600">
                        {eventDate && eventDate.toLocaleDateString()}
                      </p>
                    </div>
                    {isUpcoming ? (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                        Upcoming
                      </span>
                    ) : attendance.attendanceStatus === 'pending' ? (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                        Pending
                      </span>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          attendance.attendanceStatus === 'present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {attendance.attendanceStatus}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">No attendance records</p>
          )}
          <Link to="/attendance" className="block mt-4 text-primary-600 hover:text-primary-700 font-semibold">
            View All Attendance →
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/events" className="btn-primary inline-block">
          Browse More Events
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
