const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (authenticated user)
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

    // Deduct seats atomically
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

module.exports = { createBooking };
