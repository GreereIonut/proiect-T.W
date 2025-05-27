import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Nav, Button, Container } from 'react-bootstrap'; // Import React Bootstrap components

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" variant="light" className="mb-3"> {/* Added mb-3 for margin-bottom */}
      <Container>
        <Navbar.Brand as={Link} to="/">MyBlogApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/posts">Posts</Nav.Link>
            <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                {user && <Navbar.Text className="me-2">Hi, {user.username}! ({user.role})</Navbar.Text>}
                <Nav.Link as={Link} to="/dashboard" className="me-2">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/posts/new" className="me-2">Add Post</Nav.Link>
                <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;