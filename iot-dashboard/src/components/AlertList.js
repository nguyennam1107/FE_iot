import React, { useState, useEffect } from 'react';
import { alertService } from '../api/alerts';

const AlertList = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await alertService.getAllAlerts();
        setAlerts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch alerts');
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleResolve = async (alertId) => {
    try {
      await alertService.resolveAlert(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ));
    } catch (err) {
      setError('Failed to resolve alert');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Alerts</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Device</th>
              <th>Type</th>
              <th>Message</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert._id}>
                <td>{alert.deviceId}</td>
                <td>{alert.type}</td>
                <td>🔥</td>
                <td>{new Date(alert.timestamp).toLocaleString()}</td>
                <td>
                  <span className={`badge ${alert.resolved ? 'bg-success' : 'bg-danger'}`}>
                    {alert.resolved ? 'Resolved' : 'Active'}
                  </span>
                </td>
                <td>
                  {!alert.resolved && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleResolve(alert._id)}
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertList; 