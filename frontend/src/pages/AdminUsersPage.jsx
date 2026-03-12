import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUsers, updateUserRole } from '../services/adminService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import PageTransition from '../components/PageTransition';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data.users);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    setError('');
    setSuccess('');
    try {
      const { data } = await updateUserRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: data.user.role } : u)));
      setSuccess(`Role updated to ${newRole}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <Loader />;

  return (
    <PageTransition className="page">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Manage Users
      </motion.h1>

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <td className="font-semibold">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge badge-${user.role === 'admin' ? 'primary' : 'default'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${user.isVerified ? 'success' : 'warning'}`}>
                    {user.isVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="table-actions">
                  {user.role === 'user' ? (
                    <button className="btn btn-sm btn-primary" onClick={() => handleRoleChange(user._id, 'admin')}>
                      Make Admin
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-outline" onClick={() => handleRoleChange(user._id, 'user')}>
                      Remove Admin
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="empty-state"><p>No users found.</p></div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminUsersPage;
