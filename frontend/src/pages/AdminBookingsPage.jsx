import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBookings } from '../services/adminService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getBookings();
        setBookings(data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <PageTransition className="page">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        All Bookings
      </motion.h1>

      <ErrorMessage message={error} />

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Flight</th>
              <th>Route</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Total</th>
              <th>Status</th>
              <th>Booked On</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <motion.tr
                key={b._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <td>
                  <div className="user-cell">
                    <span className="font-semibold">{b.userId?.name || 'N/A'}</span>
                    <span className="text-muted">{b.userId?.email || ''}</span>
                  </div>
                </td>
                <td className="font-mono">{b.flightId?.flightNumber || 'N/A'}</td>
                <td>{b.flightId ? `${b.flightId.from} ✈ ${b.flightId.to}` : 'N/A'}</td>
                <td>{b.flightId ? new Date(b.flightId.date).toLocaleDateString() : 'N/A'}</td>
                <td>{b.numberOfSeats}</td>
                <td className="font-mono">${b.totalPrice}</td>
                <td>
                  <span className={`badge badge-${b.status === 'confirmed' ? 'success' : 'danger'}`}>
                    {b.status}
                  </span>
                </td>
                <td>{new Date(b.createdAt).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="empty-state"><p>No bookings found.</p></div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminBookingsPage;
