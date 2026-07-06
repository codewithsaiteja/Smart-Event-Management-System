import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Conference',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    organizer: '',
    capacity: '',
    status: 'upcoming',
  });
  const [image, setImage] = useState(null);

  const categories = ['Conference', 'Workshop', 'Seminar', 'Webinar', 'Meetup', 'Other'];

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEventById(id);
      const event = response.event;
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        venue: event.venue,
        date: event.date ? event.date.substring(0, 10) : '',
        startTime: event.startTime,
        endTime: event.endTime,
        organizer: event.organizer,
        capacity: event.capacity,
        status: event.status,
      });
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/admin/events');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (image) {
        formDataToSend.append('image', image);
      }

      await eventService.updateEvent(id, formDataToSend);
      toast.success('Event updated successfully');
      navigate('/admin/events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Event</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Enter event description"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter venue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
              <input
                type="text"
                name="organizer"
                required
                value={formData.organizer}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter organizer name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter capacity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image <span className="text-gray-400 font-normal">(leave empty to keep current)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-field"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
