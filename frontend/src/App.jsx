import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import HomePage from './pages/HomePage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminFlightsPage from './pages/AdminFlightsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminBookingsPage from './pages/AdminBookingsPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/flights" element={<AdminRoute><AdminFlightsPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default App;
