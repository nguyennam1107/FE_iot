import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { deviceService } from '../api/devices';

const DeviceReadings = () => {
  const { id } = useParams();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [readingsData, deviceData] = await Promise.all([
          deviceService.getDeviceReadings(id),
          deviceService.getDeviceById(id)
        ]);
        
        // Sort readings by timestamp (newest first)
        const sortedReadings = readingsData.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setReadings(sortedReadings);
        setDeviceInfo(deviceData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch device readings');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Readings: {deviceInfo?.name}</h2>
        <span className={`badge ${deviceInfo?.status === 'online' ? 'bg-success' : 'bg-danger'}`}>
          {deviceInfo?.status}
        </span>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Temperature & Humidity Statistics</h5>
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title text-primary">Temperature (°C)</h6>
                  {readings.length > 0 && (
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="mb-1">Latest:</p>
                        <h3>{readings[0].temperature}°C</h3>
                      </div>
                      <div>
                        <p className="mb-1">Average:</p>
                        <h3>
                          {(readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length).toFixed(1)}°C
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title text-success">Humidity (%)</h6>
                  {readings.length > 0 && (
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="mb-1">Latest:</p>
                        <h3>{readings[0].humidity}%</h3>
                      </div>
                      <div>
                        <p className="mb-1">Average:</p>
                        <h3>
                          {(readings.reduce((sum, r) => sum + r.humidity, 0) / readings.length).toFixed(1)}%
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Temperature & Humidity Chart</h5>
          {readings.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={readings.slice().reverse()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                <YAxis yAxisId="left" label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '%', angle: 90, position: 'insideRight' }} />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#007bff" name="Temperature" />
                <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#28a745" name="Humidity" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available for chart</p>
          )}
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Reading History</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Temperature (°C)</th>
                  <th>Humidity (%)</th>
                </tr>
              </thead>
              <tbody>
                {readings.map(reading => (
                  <tr key={reading._id}>
                    <td>{formatDate(reading.timestamp)}</td>
                    <td>{reading.temperature}</td>
                    <td>{reading.humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceReadings;