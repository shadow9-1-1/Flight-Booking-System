import API from './api';

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const verifyEmail = (data) => API.post('/auth/verify-email', data);
export const resendVerification = (data) => API.post('/auth/resend-verification', data);