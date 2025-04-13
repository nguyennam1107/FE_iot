import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { deviceService } from '../api/devices';

const DeviceDetail = () => {
  const { id } = useParams(); // Change to match route parameter name
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const data = await deviceService.getDeviceById(id);
        setDevice(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch device details');
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!device) return <div className="alert alert-warning">Device not found</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{device.name}</h2>
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>Device ID:</strong> {device.deviceId}</p>
              <p><strong>Location:</strong> {device.location}</p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Status:</strong> 
                <span className={`badge ${device.status === 'online' ? 'bg-success' : 'bg-danger'} ms-2`}>
                  {device.status}
                </span>
              </p>
              <p><strong>Last Seen:</strong> {new Date(device.lastSeen).toLocaleString()}</p>
            </div>
          </div>

          <h4>Threshold Settings</h4>
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-light mb-3">
                <div className="card-header">Temperature Threshold</div>
                <div className="card-body">
                  <p>Min: <strong>{device.settings?.temperatureThreshold?.min}°C</strong></p>
                  <p>Max: <strong>{device.settings?.temperatureThreshold?.max}°C</strong></p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light mb-3">
                <div className="card-header">Humidity Threshold</div>
                <div className="card-body">
                  <p>Min: <strong>{device.settings?.humidityThreshold?.min}%</strong></p>
                  <p>Max: <strong>{device.settings?.humidityThreshold?.max}%</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;