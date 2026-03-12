import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';

const loginFields = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
];

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      return setError('All fields are required');
    }

    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.user, data.token);
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      if (err.response?.status === 403) {
        setTimeout(() => navigate(`/verify-email/${encodeURIComponent(form.email)}`), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="auth-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          Log in to your FlightBooker account
        </motion.p>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          {loginFields.map((field, i) => (
            <motion.div
              key={field.name}
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <label>{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
              />
            </motion.div>
          ))}
          <motion.button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </form>
        <motion.p
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </motion.p>
      </motion.div>
    </PageTransition>
  );
};

export default LoginPage;
