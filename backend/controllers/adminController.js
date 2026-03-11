const User = require('../models/User');
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');

// Get system statistics
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalFlights, totalBookings] = await Promise.all([
      User.countDocuments(),
      Flight.countDocuments(),
      Booking.countDocuments(),
    ]);

    const [confirmedBookings, canceledBookings] = await Promise.all([
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'canceled' }),
    ]);

    res.status(200).json({
      totalUsers,
      totalFlights,
      totalBookings,
      confirmedBookings,
      canceledBookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -verificationCode -verificationCodeExpires')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email role')
      .populate('flightId', 'flightNumber from to date price')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all flights
// @route   GET /api/admin/flights
const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ date: 1 });
    res.status(200).json({ count: flights.length, flights });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a user's role
// @route   PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: 'Please provide a role' });
  }

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be user or admin' });
  }

  try {
    const user = await User.findById(req.params.id).select('-password -verificationCode -verificationCodeExpires');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getStats, getAllUsers, getAllBookings, getAllFlights, updateUserRole };
