import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import BookingCard from '../components/BookingCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setError('');
    try {
      const { data } = await getMyBookings();
      setBookings(data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'canceled' } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <PageTransition className="page">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        My Bookings
      </motion.h1>
      <ErrorMessage message={error} />
      <AnimatePresence mode="wait">
        {bookings.length === 0 ? (
          <motion.div
            key="empty"
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <p>You haven&apos;t made any bookings yet.</p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="booking-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {bookings.map((booking, i) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 120, damping: 18 }}
                >
                  <BookingCard
                    booking={booking}
                    onCancel={handleCancel}
                    cancelling={cancellingId === booking._id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default BookingHistoryPage;
