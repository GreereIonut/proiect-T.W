import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './ReviewsPage.css';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/reviews', {
          params: { filter }
        });
        setReviews(response.data.reviews || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filter]);

  const filteredReviews = searchQuery
    ? reviews.filter(review => 
        review.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reviews;

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>Book Reviews</h1>
        <div className="search-and-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
              onClick={() => setFilter('recent')}
            >
              Recent Reviews
            </button>
            <button 
              className={`filter-btn ${filter === 'top-rated' ? 'active' : ''}`}
              onClick={() => setFilter('top-rated')}
            >
              Top Rated
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : (
        <div className="reviews-grid">
          {filteredReviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews found.</p>
              <Link to="/add-review" className="add-review-button">
                Write the First Review
              </Link>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="book-info">
                    <Link to={`/books/${review.book.id}`} className="book-cover">
                      {review.book.coverUrl ? (
                        <img src={review.book.coverUrl} alt={review.book.title} />
                      ) : (
                        <div className="no-cover">No Cover</div>
                      )}
                    </Link>
                    <div className="book-details">
                      <h3>{review.book.title}</h3>
                      <p className="author">by {review.book.author}</p>
                      {review.book.category && (
                        <span className="category">{review.book.category.name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="review-content">
                  <div className="rating-date">
                    <span className="stars" title={`${review.rating} out of 5 stars`}>
                      {renderStars(review.rating)}
                    </span>
                    <span className="date">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="review-text">{review.content}</p>
                  <p className="reviewer">Review by <span>{review.user?.username || 'Anonymous'}</span></p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <Link to="/add-review" className="floating-add-button">
        <span>+</span>
      </Link>
    </div>
  );
}

export default ReviewsPage;
