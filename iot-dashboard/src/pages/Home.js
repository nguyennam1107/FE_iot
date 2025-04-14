import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deviceService } from '../api/devices';
import { alertService } from '../api/alerts';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    online: 0,
    offline: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('devices');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch devices and alerts in parallel
        const [devicesData, alertsData] = await Promise.all([
          deviceService.getAllDevices(),
          alertService.getAllAlerts()
        ]);
        
        setDevices(devicesData);
        setAlerts(alertsData);
        
        // Calculate device statistics
        const online = devicesData.filter(device => device.status === 'online').length;
        setDeviceStats({
          total: devicesData.length,
          online: online,
          offline: devicesData.length - online
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* User Profile Card */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '100px', height: '100px' }}>
                <h1>{user?.username?.charAt(0).toUpperCase() || 'U'}</h1>
              </div>
              <h4 className="card-title">{user?.username || 'User'}</h4>
              <p className="text-muted">{user?.email || 'user@example.com'}</p>
              <hr />
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Devices</h6>
                  <h4>{deviceStats.total}</h4>
                </div>
                <div>
                  <h6>Alerts</h6>
                  <h4>{alerts.filter(alert => !alert.resolved).length}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Device Status Card */}
          <div className="card mb-4">
            <div className="card-header">
              Device Status
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span>Online</span>
                  <span className="badge bg-success">{deviceStats.online}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${deviceStats.total ? (deviceStats.online / deviceStats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span>Offline</span>
                  <span className="badge bg-danger">{deviceStats.offline}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-danger" 
                    style={{ width: `${deviceStats.total ? (deviceStats.offline / deviceStats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Column */}
        <div className="col-md-8">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'devices' ? 'active' : ''}`}
                onClick={() => setActiveTab('devices')}
              >
                My Devices
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'alerts' ? 'active' : ''}`}
                onClick={() => setActiveTab('alerts')}
              >
                Alerts
              </button>
            </li>
          </ul>

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div>
              <div className="row">
                {devices.map(device => (
                  <div key={device.id} className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <h5 className="card-title">{device.name}</h5>
                          <span className={`badge ${device.status === 'online' ? 'bg-success' : 'bg-danger'}`}>
                            {device.status}
                          </span>
                        </div>
                        <p className="card-text">
                          <strong>ID:</strong> {device.deviceId}<br />
                          <strong>Location:</strong> {device.location}<br />
                          <strong>Last Seen:</strong> {new Date(device.lastSeen).toLocaleString()}
                        </p>
                        <div className="d-flex mt-3">
                          <Link to={`/devices/${device.deviceId}`} className="btn btn-sm btn-outline-primary me-2">
                            Details
                          </Link>
                          <Link to={`/devices/${device.deviceId}/readings`} className="btn btn-sm btn-outline-success">
                            Readings
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Tab - Read-only */}
          {activeTab === 'alerts' && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">System Alerts</h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Device</th>
                        <th>Type</th>
                        <th>Message</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">No alerts found</td>
                        </tr>
                      ) : (
                        alerts.map(alert => (
                          <tr key={alert._id} className={!alert.resolved ? 'table-warning' : ''}>
                            <td>{alert.deviceId}</td>
                            <td>{alert.type}</td>
                            <td>{alert.message || '🔥'}</td>
                            <td>{new Date(alert.timestamp).toLocaleString()}</td>
                            <td>
                              <span className={`badge ${alert.resolved ? 'bg-success' : 'bg-danger'}`}>
                                {alert.resolved ? 'Resolved' : 'Active'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="alert alert-info mt-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Note: Please contact an administrator if you need to resolve any active alerts.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;