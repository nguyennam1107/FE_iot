import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/users';
import { Navigate } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getUserById(user.id);
        setUserData(data);
        setFormData({
          username: data.username,
          email: data.email
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form data when canceling edit
    if (isEditing) {
      setFormData({
        username: userData.username,
        email: userData.email
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
      const updatedUser = await userService.updateUser(user._id, formData);
      setUserData(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAuthenticated) {
    return <Navigate to="/login" />;
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

  if (user?.role === 'admin') {
    return <Navigate to={`/admin/profile/${user._id}`} />;
  }

  return (
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">My Profile</h2>
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

            {!isEditing ? (
              <div className="profile-info">
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="profile-avatar">
                      <div className="avatar-circle avatar-large">
                        {userData?.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <h4>{userData?.username}</h4>
                    <p className="text-muted">{userData?.email}</p>
                    <p><strong>Role:</strong> {userData?.role}</p>
                    <p><strong>Account Created:</strong> {userData?.createdAt && new Date(userData.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;