import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(debounce);
  }, [searchInput]);

  useEffect(() => {
    fetchEvents();
  }, [search, currentPage]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10, search };
      const response = await eventService.getAllEvents(params);
      setEvents(response.events);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventService.deleteEvent(id);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
        <Link to="/admin/events/create" className="btn-primary flex items-center space-x-2">
          <FaPlus />
          <span>Create Event</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <SearchBar value={searchInput} onChange={setSearchInput} placeholder="Search events..." />
      </div>

      {events.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
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
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{event.venue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {event.availableSeats}/{event.capacity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            event.status === 'upcoming'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/events/${event._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEye size={18} />
                          </Link>
                          <Link
                            to={`/admin/events/edit/${event._id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
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
          <p className="text-gray-600 text-lg">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
