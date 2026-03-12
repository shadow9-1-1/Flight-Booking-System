import API from './api';

export const getStats = () => API.get('/admin/stats');
export const getUsers = () => API.get('/admin/users');
export const getBookings = () => API.get('/admin/bookings');
export const getFlights = () => API.get('/admin/flights');
export const updateUserRole = (id, role) => API.patch(`/admin/users/${id}/role`, { role });

export const createFlight = (data) => API.post('/flights', data);
export const updateFlight = (id, data) => API.put(`/flights/${id}`, data);
export const deleteFlight = (id) => API.delete(`/flights/${id}`);