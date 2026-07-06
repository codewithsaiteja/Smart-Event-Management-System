import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import { formatDate } from '../../utils/formatDate';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import { FaTrash, FaCalendar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await registrationService.getAllRegistrations({ page: currentPage, limit: 10 });
      setRegistrations(response.registrations);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      await registrationService.deleteRegistration(id);
      toast.success('Registration cancelled successfully');
      fetchRegistrations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Registrations</h1>

      {registrations.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6">
            {registrations.map((registration) => (
              <div key={registration._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/4 h-48 md:h-auto bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
                    {registration.eventId?.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${registration.eventId.image}`}
                        alt={registration.eventId.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaCalendar className="text-white text-6xl" />
                    )}
                  </div>

                  <div className="p-6 md:w-3/4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {registration.eventId?.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            registration.registrationStatus === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : registration.registrationStatus === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {registration.registrationStatus}
                        </span>
                      </div>
                      {registration.registrationStatus === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(registration._id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <FaTrash size={20} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaCalendar className="mr-2 text-primary-600" />
                        <span>{registration.eventId?.date && formatDate(registration.eventId.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaClock className="mr-2 text-primary-600" />
                        <span>
                          {registration.eventId?.startTime} - {registration.eventId?.endTime}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaMapMarkerAlt className="mr-2 text-primary-600" />
                        <span>{registration.eventId?.venue}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          registration.eventId?.status === 'upcoming'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {registration.eventId?.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven't registered for any events yet.</p>
          <Link to="/events" className="btn-primary inline-block">
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
