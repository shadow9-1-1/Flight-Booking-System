import API from './api';

export const searchFlights = (params) => API.get('/flights/search', { params });
