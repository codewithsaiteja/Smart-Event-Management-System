const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide event category'],
      enum: ['Conference', 'Workshop', 'Seminar', 'Webinar', 'Meetup', 'Other'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide venue'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please provide start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Please provide end time'],
    },
    organizer: {
      type: String,
      required: [true, 'Please provide organizer name'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide event capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    availableSeats: {
      type: Number,
      default: function() {
        return this.capacity;
      }
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.capacity;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
