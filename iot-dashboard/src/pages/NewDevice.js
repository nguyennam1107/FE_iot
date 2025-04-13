import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deviceService } from '../api/devices';

const NewDevice = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [device, setDevice] = useState({
    deviceId: '',
    name: '',
    location: '',
    settings: {
      temperatureThreshold: {
        min: 18,
        max: 25
      },
      humidityThreshold: {
        min: 40,
        max: 60
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThresholdChange = (type, minMax, value) => {
    setDevice(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [type]: {
          ...prev.settings[type],
          [minMax]: parseInt(value, 10)
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await deviceService.createDevice(device);
      navigate('/devices');
    } catch (err) {
      setError('Failed to create device');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Device</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="deviceId" className="form-label">Device ID</label>
              <input
                type="text"
                className="form-control"
                id="deviceId"
                name="deviceId"
                value={device.deviceId}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Device Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={device.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={device.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <h4 className="mt-4">Thresholds</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">Temperature (°C)</div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="temp-min" className="form-label">Minimum</label>
                      <input
                        type="number"
                        className="form-control"
                        id="temp-min"
                        value={device.settings.temperatureThreshold.min}
                        onChange={(e) => handleThresholdChange('temperatureThreshold', 'min', e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="temp-max" className="form-label">Maximum</label>
                      <input
                        type="number"
                        className="form-control"
                        id="temp-max"
                        value={device.settings.temperatureThreshold.max}
                        onChange={(e) => handleThresholdChange('temperatureThreshold', 'max', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">Humidity (%)</div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="humid-min" className="form-label">Minimum</label>
                      <input
                        type="number"
                        className="form-control"
                        id="humid-min"
                        value={device.settings.humidityThreshold.min}
                        onChange={(e) => handleThresholdChange('humidityThreshold', 'min', e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="humid-max" className="form-label">Maximum</label>
                      <input
                        type="number"
                        className="form-control"
                        id="humid-max"
                        value={device.settings.humidityThreshold.max}
                        onChange={(e) => handleThresholdChange('humidityThreshold', 'max', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex mt-3">
              <button type="submit" className="btn btn-primary me-2">Create Device</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/devices')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewDevice;