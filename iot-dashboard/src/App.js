import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/DeviceList';
import DeviceDetail from './pages/DeviceDetail';
import DeviceEdit from './pages/DeviceEdit';
import DeviceReadings from './pages/DeviceReadings';
import AlertList from './pages/AlertList';
import NewDevice from './pages/NewDevice';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import './App.css';


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.isAuthenticated ? children : <Navigate to="/login" />;
};

// Special route that checks if the user has admin permissions
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
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
              
              {/* Protected routes for all authenticated users */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <PrivateRoute>
                    <UserProfile />
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
                path="/devices/:id"
                element={ 
                  <PrivateRoute>
                    <DeviceDetail />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/devices/:id/readings" 
                element={
                  <PrivateRoute>
                    <DeviceReadings />
                  </PrivateRoute>
                } 
              />
              
              {/* Admin-only routes */}
              <Route 
                path="/devices/new" 
                element={
                  <AdminRoute>
                    <NewDevice />
                  </AdminRoute>
                } 
              />
              <Route
                path="/admin/profile/:id"
                element={
                  <AdminRoute>
                    <AdminProfile />
                  </AdminRoute>
                }
              />
              <Route 
                path="/devices/:id/edit" 
                element={
                  <AdminRoute>
                    <DeviceEdit/>
                  </AdminRoute>
                } 
              />
              <Route
                path="/alerts"
                element={
                  <AdminRoute>
                    <AlertList />
                  </AdminRoute>
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