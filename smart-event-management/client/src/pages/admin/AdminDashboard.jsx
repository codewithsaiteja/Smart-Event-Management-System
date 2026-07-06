import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsService } from '../../services/statsService';
import { FaUsers, FaCalendarAlt, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import { formatDate } from '../../utils/formatDate';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsService.getAdminStats();
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={FaUsers}
          color="primary"
        />
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          icon={FaCalendarAlt}
          color="green"
        />
        <StatCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          icon={FaTicketAlt}
          color="purple"
        />
        <StatCard
          title="Total Attendance"
          value={stats?.totalAttendance || 0}
          icon={FaCheckCircle}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
          {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingEvents.map((event) => (
                <div key={event._id} className="border-l-4 border-primary-600 pl-4">
                  <Link
                    to={`/admin/events`}
                    className="text-lg font-semibold text-gray-800 hover:text-primary-600"
                  >
                    {event.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.date)} at {event.startTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.availableSeats}/{event.capacity} seats available
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming events</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Registrations</h2>
          {stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
            <div className="space-y-4">
              {stats.recentRegistrations.map((registration) => (
                <div key={registration._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{registration.userId?.name}</p>
                    <p className="text-sm text-gray-600">{registration.eventId?.title}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(registration.registrationDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent registrations</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Categories</h2>
          {stats?.categoryStats && stats.categoryStats.length > 0 ? (
            <div className="space-y-3">
              {stats.categoryStats.map((category) => (
                <div key={category._id} className="flex items-center justify-between">
                  <span className="text-gray-700">{category._id}</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No category data</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/events/create" className="block w-full btn-primary text-center">
              Create New Event
            </Link>
            <Link to="/admin/users" className="block w-full btn-secondary text-center">
              Manage Users
            </Link>
            <Link to="/admin/registrations" className="block w-full btn-secondary text-center">
              View Registrations
            </Link>
            <Link to="/admin/attendance" className="block w-full btn-secondary text-center">
              Manage Attendance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
