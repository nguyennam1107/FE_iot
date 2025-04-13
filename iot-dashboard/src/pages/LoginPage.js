import { useState } from 'react';
import axios from '../api/axios';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/auth/login', form);
    localStorage.setItem('token', res.data.token);
    window.location.href = '/dashboard';
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}