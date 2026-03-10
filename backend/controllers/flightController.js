const Flight = require('../models/Flight');

// Create a new flight
// @route   POST /api/flights
const createFlight = async (req, res) => {
  const { flightNumber, from, to, date, totalSeats, availableSeats, price } = req.body;

  if (!flightNumber || !from || !to || !date || !totalSeats || availableSeats === undefined || !price) {
    return res.status(400).json({ message: 'Please provide all required flight fields' });
  }

  if (availableSeats > totalSeats) {
    return res.status(400).json({ message: 'Available seats cannot exceed total seats' });
  }

  try {
    const flight = await Flight.create({ flightNumber, from, to, date, totalSeats, availableSeats, price });
    res.status(201).json({ message: 'Flight created successfully', flight });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Flight number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all flights (with search filters)
// @route   GET /api/flights
const getFlights = async (req, res) => {
  const { from, to, date } = req.query;
  const filter = {};

  if (from) filter.from = { $regex: from, $options: 'i' };
  if (to)   filter.to   = { $regex: to,   $options: 'i' };
  if (date) {
    const start = new Date(date);
    const end   = new Date(date);
    end.setDate(end.getDate() + 1);
    filter.date = { $gte: start, $lt: end };
  }

  try {
    const flights = await Flight.find(filter).sort({ date: 1 });
    res.status(200).json({ count: flights.length, flights });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update flight info
// @route   PUT /api/flights/:id
const updateFlight = async (req, res) => {
  const { totalSeats, availableSeats } = req.body;

  if (totalSeats !== undefined && availableSeats !== undefined && availableSeats > totalSeats) {
    return res.status(400).json({ message: 'Available seats cannot exceed total seats' });
  }

  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.status(200).json({ message: 'Flight updated successfully', flight });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Flight number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search flights with dynamic filters
// @route   GET /api/flights/search
const searchFlights = async (req, res) => {
  const { from, to, date, minPrice, maxPrice, seats } = req.query;
  const filter = {};

  if (from) filter.from = { $regex: from.trim(), $options: 'i' };
  if (to)   filter.to   = { $regex: to.trim(),   $options: 'i' };

  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }
    const start = new Date(parsedDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(parsedDate);
    end.setUTCHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  // Only show flights that still have seats
  const requiredSeats = seats ? Number(seats) : 1;
  filter.availableSeats = { $gte: requiredSeats };

  try {
    const flights = await Flight.find(filter).sort({ date: 1, price: 1 });
    res.status(200).json({ count: flights.length, flights });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a flight
// @route   DELETE /api/flights/:id
const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.status(200).json({ message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createFlight, getFlights, searchFlights, updateFlight, deleteFlight };
