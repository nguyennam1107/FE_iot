import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">IoT Dashboard</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user?.isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/devices">Devices</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/alerts">Alerts</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {user?.isAuthenticated ? (
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                <Link className="btn btn-outline-light" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
