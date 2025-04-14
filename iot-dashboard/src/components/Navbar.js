import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-hdd-network me-2"></i>
          IoT Dashboard
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen ? "true" : "false"} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user?.isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/') ? 'active fw-bold' : ''}`} 
                    to="/"
                  >
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/devices') ? 'active fw-bold' : ''}`} 
                    to="/devices"
                  >
                    <i className="bi bi-cpu me-1"></i> Devices
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/alerts') ? 'active fw-bold' : ''}`} 
                    to="/alerts"
                  >
                    <i className="bi bi-exclamation-triangle me-1"></i> Alerts
                    {user.activeAlerts > 0 && (
                      <span className="badge bg-danger ms-1">{user.activeAlerts}</span>
                    )}
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {user?.isAuthenticated ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-light d-flex align-items-center"
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {user.username || 'User'}
                  <i className="bi bi-caret-down-fill ms-2 small"></i>
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show" style={{position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(0px, 40px)'}}>
                    <li>
                    <Link 
                      className="dropdown-item" 
                      to={`/profile/${user._id}`} 
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="bi bi-gear me-2"></i>Settings
                    </Link>
                  </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={() => {handleLogout(); setDropdownOpen(false);}}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                  </ul>
                )}
              </div>
            ) : (
              <div className="d-flex">
                <Link className="btn btn-outline-light me-2" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link className="btn btn-light" to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;