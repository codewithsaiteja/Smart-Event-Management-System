import { FaCalendarAlt, FaUsers, FaCheckCircle, FaChartBar } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-gray-600 text-lg">
            Smart Event Management System — built to simplify how events are organized, attended, and tracked.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We are dedicated to making event management simple and efficient for both organizers and attendees. 
            Whether it's a workshop, seminar, or large conference, our platform handles everything from 
            registrations to attendance tracking in one place.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Built for Lovely Professional University and similar institutions, the system provides 
            a centralized hub for all event-related activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-primary-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Event Management</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Create, update, and manage events with full control over capacity, scheduling, and status.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Easy Registration</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Users can register for events in seconds and manage their registrations from their dashboard.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Attendance Tracking</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Admins can mark attendance for today's and past events. Upcoming events are view-only until the event date.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FaChartBar className="text-yellow-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Dashboard Analytics</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Admins get a comprehensive dashboard with stats on users, events, registrations, and attendance.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">What We Offer</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-primary-600 mr-3 mt-0.5">✓</span>
              <span>Event discovery with search and category filters</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-3 mt-0.5">✓</span>
              <span>Secure registration with seat capacity management</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-3 mt-0.5">✓</span>
              <span>Role-based access for admins and regular users</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-3 mt-0.5">✓</span>
              <span>Professional attendance management with date-based workflow</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-3 mt-0.5">✓</span>
              <span>Image uploads for events with responsive cards</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-3 mt-0.5">✓</span>
              <span>JWT-based authentication with protected routes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
