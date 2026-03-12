import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlightCard = ({ flight, onBook, user }) => {
  const [seats, setSeats] = useState(1);
  const [showBooking, setShowBooking] = useState(false);

  const handleBook = () => {
    onBook(flight._id, seats);
    setShowBooking(false);
    setSeats(1);
  };

  return (
    <motion.div
      className="flight-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -3, boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flight-card-header">
        <span className="flight-number">{flight.flightNumber}</span>
        <span className="flight-price">${flight.price}</span>
      </div>
      <div className="flight-route">
        <span>{flight.from}</span>
        <span className="route-arrow">✈</span>
        <span>{flight.to}</span>
      </div>
      <div className="flight-details">
        <span>📅 {new Date(flight.date).toLocaleDateString()}</span>
        <span>💺 {flight.availableSeats} seats available</span>
      </div>

      {user && !showBooking && (
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowBooking(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Book Now
        </motion.button>
      )}

      {!user && (
        <p className="login-prompt">Log in to book this flight</p>
      )}

      <AnimatePresence>
        {showBooking && (
          <motion.div
            className="booking-inline"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="booking-inline-row">
              <label>Seats:</label>
              <input
                type="number"
                min="1"
                max={flight.availableSeats}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
              />
              <motion.span
                className="booking-total"
                key={seats}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Total: ${flight.price * seats}
              </motion.span>
            </div>
            <div className="booking-inline-actions">
              <motion.button
                className="btn btn-primary"
                onClick={handleBook}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Confirm Booking
              </motion.button>
              <motion.button
                className="btn btn-outline"
                onClick={() => setShowBooking(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FlightCard;
