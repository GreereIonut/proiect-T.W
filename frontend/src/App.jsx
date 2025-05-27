import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // 1. Import routing components
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
// import './App.css'; // Your App specific styles

function App() {
  return (
    <div>
      {/* 2. Basic Navigation (you will replace this with a proper NavBar later) */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          {/* Add more links as you create pages */}
        </ul>
      </nav>

      <hr />

      {/* 3. Define the routes for your application */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* You'll add routes for your data tables and other pages here later */}
      </Routes>
    </div>
  );
}

export default App;