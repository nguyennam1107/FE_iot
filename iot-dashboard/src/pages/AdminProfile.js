import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/users';
import { Navigate } from 'react-router-dom';

const AdminProfile = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') {
        setLoading(false);
        return;
      }

      try {
        // Fetch all users
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
        
        // Fetch admin's own profile
        const adminData = await userService.getUserById(user.id);
        setAdminProfile(adminData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSelectUser = (userData) => {
    setSelectedUser(userData);
    setFormData({
      username: userData.username,
      email: userData.email,
      role: userData.role
    });
    setIsEditing(false);
    setConfirmDelete(null);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && selectedUser) {
      // Reset form when canceling
      setFormData({
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const updatedUser = await userService.updateUser(selectedUser._id, formData);
      
      // Update users list and selected user
      setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      setSelectedUser(updatedUser);
      
      // Update admin profile if the admin is updating their own profile
      if (selectedUser._id === user._id) {
        setAdminProfile(updatedUser);
      }
      
      setIsEditing(false);
      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirmDelete !== userId) {
      setConfirmDelete(userId);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
      }
      setConfirmDelete(null);
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Admin Profile</h2>
            <span className="badge bg-warning">Admin</span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-2">
                <div className="admin-avatar">
                  <div className="avatar-circle avatar-large">
                    {adminProfile?.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="col-md-10">
                <h4>{adminProfile?.username}</h4>
                <p className="text-muted">{adminProfile?.email}</p>
                <p><strong>Role:</strong> {adminProfile?.role}</p>
                <p><strong>Account Created:</strong> {adminProfile?.createdAt && new Date(adminProfile.createdAt).toLocaleString()}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleSelectUser(adminProfile)}
                >
                  Edit My Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-header bg-dark text-white">
            <h3 className="mb-0">User Management</h3>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="user-list">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(userData => (
                          <tr 
                            key={userData._id}
                            className={selectedUser && selectedUser._id === userData._id ? 'table-primary' : ''}
                          >
                            <td>{userData.username}</td>
                            <td>{userData.email}</td>
                            <td>
                              <span className={`badge ${userData.role === 'admin' ? 'bg-warning' : 'bg-info'}`}>
                                {userData.role}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => handleSelectUser(userData)}
                              >
                                View
                              </button>
                              {confirmDelete === userData._id ? (
                                <>
                                  <button 
                                    className="btn btn-sm btn-danger me-1"
                                    onClick={() => handleDeleteUser(userData._id)}
                                  >
                                    Confirm
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-secondary"
                                    onClick={handleCancelDelete}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteUser(userData._id)}
                                  disabled={userData._id === user._id} // Prevent deleting yourself
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                {selectedUser && (
                  <div className="user-detail-card">
                    <h4 className="mb-3">{isEditing ? 'Edit User' : 'User Details'}</h4>
                    
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="role" className="form-label">Role</label>
                          <select
                            className="form-select"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="d-flex">
                          <button type="submit" className="btn btn-success me-2">
                            Save Changes
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleEditToggle}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="user-details">
                        <div className="mb-3 d-flex align-items-center">
                          <div className="me-3">
                            <div className="avatar-circle">
                              {selectedUser.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-0">{selectedUser.username}</h5>
                            <p className="text-muted mb-0">{selectedUser.email}</p>
                          </div>
                        </div>
                        
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <th scope="row" style={{ width: '30%' }}>User ID</th>
                              <td>{selectedUser._id}</td>
                            </tr>
                            <tr>
                              <th scope="row">Role</th>
                              <td>
                                <span className={`badge ${selectedUser.role === 'admin' ? 'bg-warning' : 'bg-info'}`}>
                                  {selectedUser.role}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Created At</th>
                              <td>{selectedUser.createdAt && new Date(selectedUser.createdAt).toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <button 
                          className="btn btn-primary"
                          onClick={handleEditToggle}
                        >
                          Edit User
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;