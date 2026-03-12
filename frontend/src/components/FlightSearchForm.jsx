import { useState } from 'react';
import { motion } from 'framer-motion';

const FlightSearchForm = ({ onSearch, loading }) => {
  const [form, setForm] = useState({ from: '', to: '', date: '', seats: 1 });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (form.from) params.from = form.from;
    if (form.to) params.to = form.to;
    if (form.date) params.date = form.date;
    if (form.seats) params.seats = form.seats;
    onSearch(params);
  };

  return (
    <motion.form
      className="search-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="search-fields">
        {[
          { name: 'from', label: 'From', placeholder: 'Departure city', type: 'text' },
          { name: 'to', label: 'To', placeholder: 'Arrival city', type: 'text' },
          { name: 'date', label: 'Date', placeholder: '', type: 'date' },
          { name: 'seats', label: 'Passengers', placeholder: '1', type: 'number' },
        ].map((field, i) => (
          <motion.div
            key={field.name}
            className="form-group"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
          >
            <label>{field.label}</label>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              min={field.type === 'number' ? '1' : undefined}
            />
          </motion.div>
        ))}
      </div>
      <motion.button
        type="submit"
        className="btn btn-primary btn-full btn-search"
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'Searching...' : 'Search Flights'}
      </motion.button>
    </motion.form>
  );
};

export default FlightSearchForm;
