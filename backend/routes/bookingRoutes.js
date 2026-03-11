const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking } = require('../controllers/bookingController');

router.post('/', protect, createBooking);

module.exports = router;
