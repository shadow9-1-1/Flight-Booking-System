const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getStats, getAllUsers, getAllBookings, getAllFlights } = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/flights', getAllFlights);

module.exports = router;
