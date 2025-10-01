import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.access_token, data.user);
        setMessage('Logged in');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Login error');
    }
  };

  return (
    <form onSubmit={login} style={{ display: 'inline-block' }}>
      <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
      <button type="submit">Login</button>
      {message && <div style={{color:'red'}}>{message}</div>}
    </form>
  );
}
