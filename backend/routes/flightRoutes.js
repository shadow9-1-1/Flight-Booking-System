const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.get('/search', /*searchFlights*/);

// Admin only
router.post('/', protect, adminOnly, /*createFlight*/);
router.put('/:id', protect, adminOnly, /*updateFlight*/);
router.delete('/:id', protect, adminOnly, /*deleteFlight*/);

module.exports = router;
