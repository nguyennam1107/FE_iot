import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deviceService } from '../api/devices';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await deviceService.getAllDevices();
        setDevices(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch devices');
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Devices</h2>
        <Link to="/devices/new" className="btn btn-primary">Add New Device</Link>
      </div>
      <div className="row">
        {devices.map(device => (
          <div key={device.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{device.name}</h5>
                <p className="card-text">
                  <strong>Device ID:</strong> {device.deviceId}<br />
                  <strong>Location:</strong> {device.location}
                </p>
                <div className="d-flex justify-content-between">
                  <Link to={`/devices/${device.id}`} className="btn btn-info">View Details</Link>
                  <Link to={`/devices/${device.id}/edit`} className="btn btn-warning">Edit</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList; 