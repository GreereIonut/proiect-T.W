import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after successful registration
import ApiClient from '../services/apiClient'; // Adjust path as needed

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission which reloads the page
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    // Basic client-side validation (you can add more)
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      // Make the API call to your backend's register endpoint
      // Ensure your backend is running and accessible at this URL
      const response = await ApiClient.post('/auth/register', {
  username,
  email,
  password,
});

      // Handle success
      setSuccessMessage(response.data.message + ' You will be redirected to login.');
      console.log('Registration successful:', response.data);
      
      // Clear form fields
      setUsername('');
      setEmail('');
      setPassword('');

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds

    } catch (err) {
      // Handle errors
      if (err.response && err.response.data && err.response.data.message) {
        // If the backend sends a specific error message
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        // If the backend sends an array of validation errors (from Joi)
        setError(err.response.data.errors.join(', '));
      }
      else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;