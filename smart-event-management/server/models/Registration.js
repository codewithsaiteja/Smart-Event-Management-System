const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    registrationStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'waitlist'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
