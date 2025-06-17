import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './RecommendationsPage.css';

function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState({
    forYou: [],
    trending: [],
    newReleases: [],
    similarToRead: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await apiClient.get('/books/recommendations');
        const bookData = response.data.recommendations || [];
        
        // Ensure we have data before processing
        if (!Array.isArray(bookData)) {
          throw new Error('Invalid data format received from server');
        }

        // Sort functions
        const byRating = (a, b) => (b.rating || 0) - (a.rating || 0);
        const byDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
        
        setRecommendations({
          forYou: bookData.slice(0, 4),
          trending: bookData
            .filter(book => (book.ratingCount || 0) > 0)
            .sort(byRating)
            .slice(0, 4),
          newReleases: [...bookData].sort(byDate).slice(0, 4),
          similarToRead: bookData
            .filter(book => (book.rating || 0) >= 4)
            .slice(0, 4)
        });
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="recommendations-container">
      <section className="recommended-section">
        <h2>Recommended for You</h2>
        <div className="books-grid">
          {recommendations.forYou?.map(book => (
            <Link to={`/books/${book.id}`} key={book.id} className="book-card">
              <div className="book-cover">
                <img src={book.coverUrl || 'https://via.placeholder.com/200x300'} alt={book.title} />
                <div className="book-rating">★ {book.rating?.toFixed(1)}</div>
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="genre">{book.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="trending-section">
        <h2>Trending Now</h2>
        <div className="books-grid">
          {recommendations.trending?.map(book => (
            <Link to={`/books/${book.id}`} key={book.id} className="book-card">
              <div className="book-cover">
                <img src={book.coverUrl || 'https://via.placeholder.com/200x300'} alt={book.title} />
                <div className="trending-rank">#${book.trendingRank}</div>
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="trend-info">{book.trendsCount} readers this week</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="new-releases-section">
        <h2>New Releases</h2>
        <div className="books-grid">
          {recommendations.newReleases?.map(book => (
            <Link to={`/books/${book.id}`} key={book.id} className="book-card">
              <div className="book-cover">
                <img src={book.coverUrl || 'https://via.placeholder.com/200x300'} alt={book.title} />
                <div className="new-badge">New</div>
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="release-date">Released {new Date(book.releaseDate).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="similar-reads-section">
        <h2>Based on Your Reading History</h2>
        <div className="books-grid">
          {recommendations.similarToRead?.map(book => (
            <Link to={`/books/${book.id}`} key={book.id} className="book-card">
              <div className="book-cover">
                <img src={book.coverUrl || 'https://via.placeholder.com/200x300'} alt={book.title} />
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="similarity">Because you read: {book.similarTo}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RecommendationsPage;
