import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deviceService } from '../api/devices';

const DeviceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [device, setDevice] = useState({
    name: '',
    location: '',
    settings: {
      temperatureThreshold: {
        min: 0,
        max: 0
      },
      humidityThreshold: {
        min: 0,
        max: 0
      }
    }
  });

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const data = await deviceService.getDeviceById(id);
        setDevice(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch device details');
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

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
      await deviceService.updateDevice(id, {
        name: device.name,
        location: device.location,
        settings: device.settings
      });
      navigate(`/devices/${id}`);
    } catch (err) {
      setError('Failed to update device');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit Device: {device.name}</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
              <button type="submit" className="btn btn-primary me-2">Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(`/devices/${id}`)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceEdit;