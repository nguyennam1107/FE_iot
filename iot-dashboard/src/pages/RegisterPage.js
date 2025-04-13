import { useState } from 'react';
import axios from '../api/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/auth/register', form);
    alert('Đăng ký thành công!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Đăng ký</button>
    </form>
  );
}