import { motion } from 'framer-motion';

const BookingCard = ({ booking, onCancel, cancelling }) => {
  const flight = booking.flightId;

  return (
    <motion.div
      className={`booking-card ${booking.status === 'canceled' ? 'booking-canceled' : ''}`}
      layout
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="booking-card-header">
        <span className="flight-number">{flight?.flightNumber || 'N/A'}</span>
        <motion.span
          className={`booking-status status-${booking.status}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
        >
          {booking.status}
        </motion.span>
      </div>
      <div className="flight-route">
        <span>{flight?.from || '—'}</span>
        <span className="route-arrow">✈</span>
        <span>{flight?.to || '—'}</span>
      </div>
      <div className="booking-details">
        <span>📅 {flight?.date ? new Date(flight.date).toLocaleDateString() : '—'}</span>
        <span>💺 {booking.numberOfSeats} seat(s)</span>
        <span>💰 ${booking.totalPrice}</span>
      </div>
      {booking.status === 'confirmed' && (
        <motion.button
          className="btn btn-danger"
          onClick={() => onCancel(booking._id)}
          disabled={cancelling}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {cancelling ? 'Cancelling...' : 'Cancel Booking'}
        </motion.button>
      )}
    </motion.div>
  );
};

export default BookingCard;
