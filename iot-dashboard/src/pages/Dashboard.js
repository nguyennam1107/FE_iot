import React, { useState, useEffect } from 'react';
import { deviceService } from '../api/devices';
import { alertService } from '../api/alerts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeAlerts: 0,
    totalReadings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [devices, alerts] = await Promise.all([
          deviceService.getAllDevices(),
          alertService.getAllAlerts()
        ]);

        setStats({
          totalDevices: devices.length,
          activeAlerts: alerts.filter(alert => !alert.resolved).length,
          totalReadings: devices.reduce((acc, device) => acc + (device.readings?.length || 0), 0)
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard Overview</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Devices</h5>
              <h2 className="card-text">{stats.totalDevices}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Active Alerts</h5>
              <h2 className="card-text">{stats.activeAlerts}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Readings</h5>
              <h2 className="card-text">{stats.totalReadings}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 