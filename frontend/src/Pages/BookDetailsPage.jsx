import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './BookDetailsPage.css';

function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await apiClient.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        setError('Failed to load book details. ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!book) return <div className="not-found">Book not found</div>;

  return (
    <div className="book-details-container">
      <div className="book-header">
        <div className="book-cover">
          <img src={book.coverUrl || 'https://via.placeholder.com/200x300'} alt={book.title} />
        </div>
        <div className="book-info">
          <h1>{book.title}</h1>
          <h2>by {book.author}</h2>
          <div className="book-meta">
            <span className="genre">{book.genre}</span>
            <span className="rating">★ {book.rating?.toFixed(1) || 'N/A'}</span>
            {book.isbn && <span className="isbn">ISBN: {book.isbn}</span>}
          </div>
          <p className="description">{book.description}</p>
          <div className="action-buttons">
            <button className="btn-primary">Add to Reading List</button>
            <button className="btn-secondary">Write a Review</button>
          </div>
        </div>
      </div>

      <div className="book-content">
        <section className="reviews-section">
          <h3>Reviews</h3>
          {book.reviews?.length > 0 ? (
            <div className="reviews-list">
              {book.reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <span className="reviewer">{review.user}</span>
                    <span className="rating">★ {review.rating}</span>
                    <span className="date">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review this book!</p>
          )}
        </section>

        <section className="similar-books">
          <h3>Similar Books</h3>
          <div className="similar-books-grid">
            {book.similarBooks?.map((similar, index) => (
              <div key={index} className="similar-book-card">
                <img src={similar.coverUrl || 'https://via.placeholder.com/150x200'} alt={similar.title} />
                <h4>{similar.title}</h4>
                <p>{similar.author}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BookDetailsPage;
