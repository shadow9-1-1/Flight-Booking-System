import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -68, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to="/home" className="navbar-brand">✈ FlightBooker</Link>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div
              key="auth-links"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="navbar-auth-links"
            >
              <Link to="/bookings">My Bookings</Link>
              {user.role === 'admin' && <Link to="/admin" className="nav-admin-link">Admin</Link>}
              <span className="navbar-user">Hi, {user.name}</span>
              <motion.button
                onClick={handleLogout}
                className="btn btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="guest-links"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="navbar-auth-links"
            >
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
