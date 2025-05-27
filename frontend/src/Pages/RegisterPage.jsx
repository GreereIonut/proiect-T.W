import React, { useState } from 'react';
import axios from 'axios'; // Or your apiClient
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// Import React Bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    // You could add more client-side validation here (e.g., password complexity)

    try {
      // Replace with apiClient if you prefer:
      // import apiClient from '../services/apiClient';
      // const response = await apiClient.post('/auth/register', { username, email, password });
      const response = await axios.post('http://localhost:8000/api/auth/register', {
        username,
        email,
        password,
      });

      setSuccessMessage(response.data.message + ' Redirecting to login...');
      console.log('Registration successful:', response.data);
      
      setUsername('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err.response || err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={4}>
          <h2 className="mb-4 text-center">Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formRegisterUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} // Example: Enforce min length in HTML
              />
            </Form.Group>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
            
            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <p>Already have an account? <RouterLink to="/login">Login here</RouterLink></p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;