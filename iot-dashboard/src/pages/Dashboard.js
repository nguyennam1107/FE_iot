import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    axios.get('/devices').then(res => setDevices(res.data));
  }, []);

  return (
    <div>
      <h1>Thiết bị</h1>
      <ul>
        {devices.map(d => (
          <li key={d.deviceId}>{d.name} - {d.location}</li>
        ))}
      </ul>
    </div>
  );
}