import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Added Link for the 404 example

// Import Page Components
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import PostsListPage from './Pages/PostsListPage';
import AddPostPage from './Pages/AddPostPage';
import EditPostPage from './Pages/EditPostPage';
import CategoriesListPage from './Pages/CategoriesListPage';

// Import Custom Components
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

// Optional: Your main App CSS if you have one
// import './App.css'; 

function App() {
  return (
    <div>
      <NavBar />
      
      {/* A main content area for the pages */}
      <div style={{ paddingTop: '1px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostsListPage />} />
          <Route path="/categories" element={<CategoriesListPage />} />

          {/* Protected Routes - only accessible to logged-in users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/new" 
            element={
              <ProtectedRoute>
                <AddPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/edit/:postId" 
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback route for unmatched paths (404 Not Found) */}
          <Route 
            path="*" 
            element={
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>404 - Page Not Found</h2>
                <p>Sorry, the page you are looking for does not exist.</p>
                <Link to="/">Go to Homepage</Link>
              </div>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;