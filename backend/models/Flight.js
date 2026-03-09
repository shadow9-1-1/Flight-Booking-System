const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: [true, 'Flight number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    from: {
      type: String,
      required: [true, 'Departure location is required'],
      trim: true,
    },
    to: {
      type: String,
      required: [true, 'Arrival location is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Flight date is required'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats is required'],
      min: [0, 'Available seats cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { timestamps: true }
);

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
