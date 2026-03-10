const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createFlight, getFlights, searchFlights, updateFlight, deleteFlight } = require('../controllers/flightController');

// Public
router.get('/search', searchFlights);
router.get('/', getFlights);

// Admin only
router.post('/', protect, adminOnly, createFlight);
router.put('/:id', protect, adminOnly, updateFlight);
router.delete('/:id', protect, adminOnly, deleteFlight);

module.exports = router;
