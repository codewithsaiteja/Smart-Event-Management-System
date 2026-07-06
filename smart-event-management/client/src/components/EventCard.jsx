import { Link } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import { formatDate } from '../utils/formatDate';

const EventCard = ({ event }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Conference: 'bg-blue-100 text-blue-800',
      Workshop: 'bg-green-100 text-green-800',
      Seminar: 'bg-purple-100 text-purple-800',
      Webinar: 'bg-yellow-100 text-yellow-800',
      Meetup: 'bg-pink-100 text-pink-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
        {event.image ? (
          <img
            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${event.image}`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaCalendar className="text-white text-6xl" />
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              event.status === 'upcoming'
                ? 'bg-green-100 text-green-800'
                : event.status === 'completed'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {event.status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <FaCalendar className="mr-2 text-primary-600" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FaClock className="mr-2 text-primary-600" />
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FaMapMarkerAlt className="mr-2 text-primary-600" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FaUsers className="mr-2 text-primary-600" />
            <span>
              {event.availableSeats}/{event.capacity} seats available
            </span>
          </div>
        </div>

        <Link to={`/events/${event._id}`} className="block w-full text-center btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
