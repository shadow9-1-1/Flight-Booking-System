const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

// Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  const { flightId, numberOfSeats } = req.body;

  if (!flightId || !numberOfSeats) {
    return res.status(400).json({ message: 'Please provide flightId and numberOfSeats' });
  }

  if (!Number.isInteger(Number(numberOfSeats)) || numberOfSeats < 1) {
    return res.status(400).json({ message: 'numberOfSeats must be a positive integer' });
  }

  // Use a session to make seat deduction + booking creation atomic
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const flight = await Flight.findById(flightId).session(session);

    if (!flight) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.availableSeats < numberOfSeats) {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Not enough seats. Only ${flight.availableSeats} seat(s) available`,
      });
    }

    const totalPrice = flight.price * numberOfSeats;

    // Deduct seats
    flight.availableSeats -= numberOfSeats;
    await flight.save({ session });

    const booking = await Booking.create(
      [{ userId: req.user._id, flightId, numberOfSeats, totalPrice }],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: booking[0],
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// Get all bookings for user
// @route   GET /api/bookings/my-bookings
const BookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('flightId', 'flightNumber from to date availableSeats totalSeats price')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel a booking and restore seats
// @route   PUT /api/bookings/:id
const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.id).session(session);

    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure only the booking user can cancel
    if (booking.userId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'canceled') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Booking is already canceled' });
    }

    // Restore available seats on the flight
    const flight = await Flight.findById(booking.flightId).session(session);
    if (flight) {
      flight.availableSeats += booking.numberOfSeats;
      await flight.save({ session });
    }

    booking.status = 'canceled';
    await booking.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: 'Booking canceled successfully', booking });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

module.exports = { createBooking, BookingHistory, cancelBooking };
