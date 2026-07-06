import { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import EventCard from '../../components/EventCard';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Conference', 'Workshop', 'Seminar', 'Webinar', 'Meetup', 'Other'];

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(debounce);
  }, [searchInput]);

  useEffect(() => {
    fetchEvents();
  }, [search, category, status, sort, currentPage]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        search,
        category,
        status,
        sort,
      };

      const response = await eventService.getAllEvents(params);
      setEvents(response.events);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Explore Events</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search events..."
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="date">By Date</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
