import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DeviceList from './components/DeviceList';
import AlertList from './components/AlertList';
import './App.css';

// Import your components here
// import Login from './components/Login';
// import Register from './components/Register';
// import Dashboard from './components/Dashboard';
// import Devices from './components/Devices';
// import Alerts from './components/Alerts';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/devices"
                element={
                  <PrivateRoute>
                    <DeviceList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <PrivateRoute>
                    <AlertList />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
