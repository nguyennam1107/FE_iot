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
                path="/devices/new" 
                element={
                <PrivateRoute>
                  <NewDevice />
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
                path="/devices/:id/edit" 
                element={
                  <PrivateRoute>
                    <DeviceEdit/>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/devices/:id/readings" 
                element={
                <DeviceReadings />
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
