import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStats } from '../services/adminService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: '👥', color: '#6366f1' },
  { key: 'totalFlights', label: 'Total Flights', icon: '✈️', color: '#06b6d4' },
  { key: 'totalBookings', label: 'Total Bookings', icon: '📋', color: '#f59e0b' },
  { key: 'confirmedBookings', label: 'Confirmed', icon: '✅', color: '#10b981' },
  { key: 'canceledBookings', label: 'Canceled', icon: '❌', color: '#ef4444' },
];

const quickLinks = [
  { to: '/admin/flights', label: 'Manage Flights', icon: '✈️' },
  { to: '/admin/users', label: 'Manage Users', icon: '👥' },
  { to: '/admin/bookings', label: 'View Bookings', icon: '📋' },
];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <PageTransition className="page">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Admin Dashboard
      </motion.h1>
      <ErrorMessage message={error} />

      {stats && (
        <div className="admin-stats-grid">
          {statCards.map((card, i) => (
            <motion.div
              key={card.key}
              className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}
            >
              <div className="stat-icon" style={{ background: card.color + '18', color: card.color }}>
                {card.icon}
              </div>
              <div className="stat-value">{stats[card.key]}</div>
              <div className="stat-label">{card.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.h2
        className="admin-section-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Quick Actions
      </motion.h2>
      <div className="admin-quick-links">
        {quickLinks.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 + i * 0.08 }}
          >
            <Link to={link.to} className="admin-quick-link">
              <span className="quick-link-icon">{link.icon}</span>
              <span>{link.label}</span>
              <span className="quick-link-arrow">→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
};

export default AdminDashboardPage;
