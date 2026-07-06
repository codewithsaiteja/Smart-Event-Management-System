import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import EventCard from '../../components/EventCard';
import Loader from '../../components/Loader';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await eventService.getAllEvents({ upcoming: true, limit: 3 });
      setUpcomingEvents(response.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover and Manage Amazing Events
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of attendees in experiencing the best conferences, workshops, and
            seminars. Manage your events efficiently with our smart platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/events" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Events
            </Link>
            <Link to="/register" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors border-2 border-white">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Discover Events</h3>
              <p className="text-gray-600">
                Browse through a wide variety of events across different categories and find what
                interests you.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Registration</h3>
              <p className="text-gray-600">
                Register for events with just a few clicks and get instant confirmation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-purple-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Track Attendance</h3>
              <p className="text-gray-600">
                Keep track of your attendance and manage all your registered events in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
            <p className="text-gray-600">Don't miss out on these exciting events</p>
          </div>

          {loading ? (
            <Loader />
          ) : upcomingEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  to="/events"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  <span>View All Events</span>
                  <FaArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">No upcoming events at the moment.</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community and start discovering amazing events today!
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
