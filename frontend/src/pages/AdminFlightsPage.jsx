import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFlights, createFlight, updateFlight, deleteFlight } from '../services/adminService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';

const emptyForm = { flightNumber: '', from: '', to: '', date: '', totalSeats: '', availableSeats: '', price: '' };

const AdminFlightsPage = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFlights = async () => {
    try {
      const { data } = await getFlights();
      setFlights(data.flights);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFlights(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      ...form,
      totalSeats: Number(form.totalSeats),
      availableSeats: Number(form.availableSeats),
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await updateFlight(editingId, payload);
        setSuccess('Flight updated successfully');
      } else {
        await createFlight(payload);
        setSuccess('Flight created successfully');
      }
      resetForm();
      fetchFlights();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const startEdit = (flight) => {
    setForm({
      flightNumber: flight.flightNumber,
      from: flight.from,
      to: flight.to,
      date: flight.date.slice(0, 10),
      totalSeats: String(flight.totalSeats),
      availableSeats: String(flight.availableSeats),
      price: String(flight.price),
    });
    setEditingId(flight._id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;
    setError('');
    setSuccess('');
    try {
      await deleteFlight(id);
      setSuccess('Flight deleted');
      setFlights((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <PageTransition className="page">
      <div className="admin-page-header">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Manage Flights
        </motion.h1>
        <motion.button
          className="btn btn-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {showForm ? 'Cancel' : '+ Add Flight'}
        </motion.button>
      </div>

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

      <AnimatePresence>
        {showForm && (
          <motion.form
            className="admin-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{editingId ? 'Edit Flight' : 'New Flight'}</h3>
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Flight Number</label>
                <input name="flightNumber" value={form.flightNumber} onChange={handleChange} placeholder="e.g. MS402" required />
              </div>
              <div className="form-group">
                <label>From</label>
                <input name="from" value={form.from} onChange={handleChange} placeholder="Departure city" required />
              </div>
              <div className="form-group">
                <label>To</label>
                <input name="to" value={form.to} onChange={handleChange} placeholder="Arrival city" required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Total Seats</label>
                <input name="totalSeats" type="number" value={form.totalSeats} onChange={handleChange} min="1" required />
              </div>
              <div className="form-group">
                <label>Available Seats</label>
                <input name="availableSeats" type="number" value={form.availableSeats} onChange={handleChange} min="0" required />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} min="0" step="0.01" required />
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Flight' : 'Create Flight'}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Flight #</th>
              <th>Route</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, i) => (
              <motion.tr
                key={flight._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <td className="font-mono">{flight.flightNumber}</td>
                <td>{flight.from} ✈ {flight.to}</td>
                <td>{new Date(flight.date).toLocaleDateString()}</td>
                <td>{flight.availableSeats}/{flight.totalSeats}</td>
                <td className="font-mono">${flight.price}</td>
                <td className="table-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => startEdit(flight)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(flight._id)}>Delete</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {flights.length === 0 && (
          <div className="empty-state"><p>No flights yet. Add your first flight above.</p></div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminFlightsPage;
