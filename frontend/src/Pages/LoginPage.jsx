import React, { useState } from 'react';
import axios from 'axios'; // Or your apiClient if you prefer to use it here directly
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Renamed Link to avoid conflict
import { useAuth } from '../context/AuthContext';

// Import React Bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert'; // For displaying errors

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      // Assuming your apiClient is set up, or use axios directly
      // For consistency, if you created apiClient, it's good to use it:
      // import apiClient from '../services/apiClient';
      // const response = await apiClient.post('/auth/login', { email, password });
      
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        login(response.data.token);
        console.log('Login successful, token processed by AuthContext.');
        navigate('/'); // Redirect to home or dashboard
      } else {
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
    <Container className="mt-5"> {/* mt-5 adds margin-top */}
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={4}>
          <h2 className="mb-4 text-center">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <p>Don't have an account? <RouterLink to="/register">Register here</RouterLink></p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;