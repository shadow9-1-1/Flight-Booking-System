import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getAllFlights } from '../services/flightService';

const FlightSearchForm = ({ onSearch, loading }) => {
  const [form, setForm] = useState({ from: '', to: '', date: '', seats: 1 });
  const [cities, setCities] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await getAllFlights();
        const allCities = new Set();
        data.flights.forEach((f) => {
          allCities.add(f.from);
          allCities.add(f.to);
        });
        setCities([...allCities].sort());
      } catch {
        // will retry on next mount
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilteredCities = useCallback((value) => {
    if (!value) return cities;
    const lower = value.toLowerCase();
    return cities.filter((c) => c.toLowerCase().includes(lower));
  }, [cities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'from' || name === 'to') {
      setActiveField(name);
    }
  };

  const selectSuggestion = (field, city) => {
    setForm((prev) => ({ ...prev, [field]: city }));
    setActiveField(null);
    if (field === 'from') {
      toRef.current?.focus();
    }
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

  const renderSuggestions = (field) => {
    if (activeField !== field) return null;
    const filtered = getFilteredCities(form[field]);
    if (filtered.length === 0) return null;
    return (
      <ul className="suggestions-list">
        {filtered.map((city) => (
          <li
            key={city}
            onMouseDown={() => selectSuggestion(field, city)}
          >
            {city}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <motion.form
      className="search-form"
      onSubmit={handleSubmit}
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="search-fields">
        {/* From */}
        <motion.div
          className="form-group autocomplete-wrapper"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <label>From</label>
          <input
            ref={fromRef}
            name="from"
            type="text"
            placeholder="Departure city"
            value={form.from}
            onChange={handleChange}
            onFocus={() => setActiveField('from')}
            autoComplete="off"
          />
          {renderSuggestions('from')}
        </motion.div>

        {/* To */}
        <motion.div
          className="form-group autocomplete-wrapper"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
        >
          <label>To</label>
          <input
            ref={toRef}
            name="to"
            type="text"
            placeholder="Arrival city"
            value={form.to}
            onChange={handleChange}
            onFocus={() => setActiveField('to')}
            autoComplete="off"
          />
          {renderSuggestions('to')}
        </motion.div>

        {/* Date — optional */}
        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.29 }}
        >
          <label>Date <span className="optional-tag">Optional</span></label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
        </motion.div>

        {/* Passengers */}
        <motion.div
          className="form-group"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.36 }}
        >
          <label>Passengers</label>
          <input
            name="seats"
            type="number"
            placeholder="1"
            value={form.seats}
            onChange={handleChange}
            min="1"
          />
        </motion.div>
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
