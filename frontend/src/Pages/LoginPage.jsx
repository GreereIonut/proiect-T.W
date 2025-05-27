import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // You correctly imported this

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth(); // Get the login function from our AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        // Use the login function from AuthContext
        // This will handle localStorage and update global state
        login(response.data.token); 
        
        console.log('Login successful, token processed by AuthContext.');
        navigate('/'); // Redirect to home or dashboard
      } else {
        // This case should ideally not happen if backend sends token on success
        setError('Login successful, but no token received. Please contact support.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
      console.error('Login error:', err.response || err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;