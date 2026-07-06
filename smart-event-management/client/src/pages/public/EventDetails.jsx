import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaUser,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin' && event) {
      checkUserRegistration();
    }
  }, [isAuthenticated, event]);

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEventById(id);
      setEvent(response.event);
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = async () => {
    setCheckingRegistration(true);
    try {
      const response = await registrationService.checkRegistration(id);
      setIsRegistered(response.isRegistered);
    } catch (error) {
      // If not authenticated or check fails, treat as not registered
      setIsRegistered(false);
    } finally {
      setCheckingRegistration(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to register for this event');
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      await registrationService.createRegistration({ eventId: id });
      toast.success('Successfully registered for the event!');
      setIsRegistered(true);
      // Refresh event to update seat count
      const response = await eventService.getEventById(id);
      setEvent(response.event);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRegistrationButton = () => {
    // Admin users don't register
    if (user?.role === 'admin') return null;

    if (checkingRegistration) {
      return (
        <div className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-lg text-center font-medium">
          Checking registration...
        </div>
      );
    }

    // Already registered
    if (isRegistered) {
      return (
        <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center font-semibold flex items-center justify-center space-x-2">
          <FaCheckCircle />
          <span>You are registered for this event</span>
        </div>
      );
    }

    // Event completed
    if (event.status === 'completed') {
      return (
        <div className="w-full bg-gray-100 text-gray-600 px-4 py-3 rounded-lg text-center font-semibold">
          Event Completed
        </div>
      );
    }

    // Event cancelled
    if (event.status === 'cancelled') {
      return (
        <div className="w-full bg-red-100 text-red-700 px-4 py-3 rounded-lg text-center font-semibold">
          Event Cancelled
        </div>
      );
    }

    // No seats available
    if (event.availableSeats <= 0) {
      return (
        <div className="w-full bg-orange-100 text-orange-700 px-4 py-3 rounded-lg text-center font-semibold">
          Registration Closed — Event is Full
        </div>
      );
    }

    // Upcoming or ongoing — show register button
    if (event.status === 'upcoming' || event.status === 'ongoing') {
      if (!isAuthenticated) {
        return (
          <div className="space-y-3">
            <button
              onClick={handleRegister}
              className="w-full btn-primary"
            >
              Register Now
            </button>
            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-primary-600 hover:underline">Login</Link> or{' '}
              <Link to="/register" className="text-primary-600 hover:underline">create an account</Link> to register
            </p>
          </div>
        );
      }

      return (
        <button
          onClick={handleRegister}
          disabled={registering}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3"
        >
          {registering ? 'Registering...' : 'Register Now'}
        </button>
      );
    }

    return null;
  };

  if (loading) return <Loader />;

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Event not found.</p>
        <Link to="/events" className="btn-primary inline-block mt-4">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/events"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
        >
          <FaArrowLeft />
          <span>Back to Events</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image / Banner */}
          <div className="h-64 bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center relative">
            {event.image ? (
              <img
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${event.image}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaCalendar className="text-white text-8xl opacity-40" />
            )}
          </div>

          <div className="p-8">
            {/* Category + Status */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusBadgeClass(event.status)}`}>
                {event.status}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">{event.title}</h1>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <FaCalendar className="mr-3 text-primary-600 flex-shrink-0" size={18} />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-3 text-primary-600 flex-shrink-0" size={18} />
                <span>{event.startTime} – {event.endTime}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-3 text-primary-600 flex-shrink-0" size={18} />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaUser className="mr-3 text-primary-600 flex-shrink-0" size={18} />
                <span>{event.organizer}</span>
              </div>
            </div>

            {/* Seat Availability */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Available Seats</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {event.availableSeats}
                    <span className="text-gray-400 text-lg font-normal"> / {event.capacity}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-primary-600">
                  <FaUsers size={32} />
                </div>
              </div>
              {/* Seat progress bar */}
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((event.capacity - event.availableSeats) / event.capacity) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {event.capacity - event.availableSeats} of {event.capacity} seats taken
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About This Event</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Registration Action */}
            {renderRegistrationButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
