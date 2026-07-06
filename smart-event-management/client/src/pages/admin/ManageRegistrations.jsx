import { useState, useEffect } from 'react';
import { registrationService } from '../../services/registrationService';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

const ManageRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, filter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10 };
      if (filter) params.status = filter;

      const response = await registrationService.getAllRegistrations(params);
      setRegistrations(response.registrations);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      await registrationService.deleteRegistration(id);
      toast.success('Registration deleted successfully');
      fetchRegistrations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete registration');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Registrations</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field"
        >
          <option value="">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="waitlist">Waitlist</option>
        </select>
      </div>

      {registrations.length > 0 ? (
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
                      Registration Date
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
                  {registrations.map((registration) => (
                    <tr key={registration._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.userId?.name}
                        </div>
                        <div className="text-sm text-gray-500">{registration.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.eventId?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.eventId?.date && formatDate(registration.eventId.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(registration.registrationDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            registration.registrationStatus === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : registration.registrationStatus === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {registration.registrationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(registration._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
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
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No registrations found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageRegistrations;
