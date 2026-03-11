const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, BookingHistory } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, BookingHistory);

module.exports = router;
