import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Page Components
import HomePage from './Pages/HomePage'; // Corrected path
import LoginPage from './Pages/LoginPage'; // Corrected path
import RegisterPage from './Pages/RegisterPage'; // Corrected path
import DashboardPage from './Pages/DashboardPage'; // Corrected path
import PostsListPage from './Pages/PostsListPage'; // 1. Import your new PostsListPage

// Import Custom Components
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

// Optional: Your main App CSS if you have one
// import './App.css'; 

function App() {
  return (
    <div>
      <NavBar />
      <div style={{ paddingTop: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostsListPage />} /> {/* 2. Add route for Posts List */}

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;