import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
  };

  const ulStyle = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
  };

  const buttonStyle = {
    padding: '5px 10px',
    cursor: 'pointer',
  };

  return (
    <nav style={navStyle}>
      <div style={ulStyle}>
        <li style={{ fontWeight: 'bold' }}>
          <Link to="/" style={linkStyle}>MyBlogApp</Link>
        </li>
        <li>
          <Link to="/" style={linkStyle}>Home</Link>
        </li>
        <li>
          <Link to="/posts" style={linkStyle}>Posts</Link> {/* <-- ADDED THIS LINK */}
        </li>
      </div>
      <div style={ulStyle}>
        {isAuthenticated ? (
          <>
            {user && <li><span style={{ marginRight: '10px' }}>Hi, {user.username}!</span></li>}
            <li>
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" style={linkStyle}>Login</Link>
            </li>
            <li>
              <Link to="/register" style={linkStyle}>Register</Link>
            </li>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;