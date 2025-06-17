import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Page Components
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/DashboardPage';
import PostsListPage from './Pages/PostsListPage';
import AddPostPage from './Pages/AddPostPage';
import EditPostPage from './Pages/EditPostPage';
import CategoriesListPage from './Pages/CategoriesListPage';
import AddCategoryPage from './Pages/AddCategoryPage';
import BookForumPage from './Pages/BookForumPage';
import BookDetailsPage from './Pages/BookDetailsPage';
import BrowseBooksPage from './Pages/BrowseBooksPage';
import ReviewsPage from './Pages/ReviewsPage';
import RecommendationsPage from './Pages/RecommendationsPage';
import MyBooksPage from './Pages/MyBooksPage';
import AddBookPage from './Pages/AddBookPage';
import AddReviewPage from './Pages/AddReviewPage';

// Import Custom Components
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

// Import CSS
import './App.css';

function App() {
  return (
    <div className="app">
      <NavBar />
      
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Book Routes */}
          <Route path="/books" element={<BrowseBooksPage />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />          {/* Protected Book Routes */}
          <Route path="/my-books" element={
            <ProtectedRoute>
              <MyBooksPage />
            </ProtectedRoute>
          } />
          <Route path="/add-book" element={
            <ProtectedRoute>
              <AddBookPage />
            </ProtectedRoute>
          } />
          <Route path="/books/:id/add-review" element={
            <ProtectedRoute>
              <AddReviewPage />
            </ProtectedRoute>
          } />
          <Route path="/books/:id/forum" element={
            <ProtectedRoute>
              <BookForumPage />
            </ProtectedRoute>
          } />
          
          {/* Legacy/Admin Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/posts" element={<PostsListPage />} />
          <Route path="/posts/add" element={
            <ProtectedRoute>
              <AddPostPage />
            </ProtectedRoute>
          } />
          <Route path="/posts/:id/edit" element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={<CategoriesListPage />} />
          <Route path="/categories/add" element={
            <ProtectedRoute>
              <AddCategoryPage />
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={
            <div className="not-found">
              <h1>404 - Page Not Found</h1>
              <p>Sorry, the page you are looking for does not exist.</p>
              <button onClick={() => window.history.back()}>Go Back</button>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;