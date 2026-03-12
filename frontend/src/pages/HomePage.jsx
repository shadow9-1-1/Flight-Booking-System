import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { searchFlights } from '../services/flightService';
import { createBooking } from '../services/bookingService';
import FlightSearchForm from '../components/FlightSearchForm';
import FlightCard from '../components/FlightCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';

const HomePage = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (params) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await searchFlights(params);
      setFlights(data.flights);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flightId, numberOfSeats) => {
    setError('');
    setSuccess('');
    try {
      await createBooking({ flightId, numberOfSeats });
      setSuccess('Booking confirmed successfully!');
      setFlights((prev) =>
        prev.map((f) =>
          f._id === flightId ? { ...f, availableSeats: f.availableSeats - numberOfSeats } : f
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <PageTransition className="page">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Search Flights
      </motion.h1>
      <FlightSearchForm onSearch={handleSearch} loading={loading} />
      <ErrorMessage message={error} />
      <AnimatePresence>
        {success && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>
      {loading && <Loader />}
      <AnimatePresence>
        {!loading && searched && flights.length === 0 && (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <p>No flights found. Try adjusting your search criteria.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flight-list">
        <AnimatePresence>
          {flights.map((flight, i) => (
            <motion.div
              key={flight._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 120, damping: 18 }}
            >
              <FlightCard flight={flight} onBook={handleBook} user={user} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default HomePage;
