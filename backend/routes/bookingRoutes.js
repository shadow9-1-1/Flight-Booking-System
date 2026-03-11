const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, BookingHistory, cancelBooking } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, BookingHistory);
router.put('/:id', protect, cancelBooking);

module.exports = router;
