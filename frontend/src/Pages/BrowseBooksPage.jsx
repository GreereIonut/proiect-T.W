import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './BrowseBooksPage.css';

function BrowseBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    sort: 'title',
    search: ''
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apiClient.get('/books', { params: filters });
        setBooks(response.data.books || []);
      } catch (error) {
        setError('Failed to load books. ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="browse-books-container">
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            name="search"
            placeholder="Search books..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-options">
          <select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Romance</option>
            <option value="Thriller">Thriller</option>
            <option value="Horror">Horror</option>
          </select>

          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="title">Title A-Z</option>
            <option value="-title">Title Z-A</option>
            <option value="rating">Rating High-Low</option>
            <option value="-rating">Rating Low-High</option>
            <option value="date">Newest First</option>
            <option value="-date">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="books-grid">
        {books.length > 0 ? (
          books.map(book => (
            <Link to={`/books/${book.id}`} key={book.id} className="book-card">
              <div className="book-cover">
                <img src={book.coverUrl || 'https://via.placeholder.com/200x300'} alt={book.title} />
                {book.rating && <div className="book-rating">★ {book.rating.toFixed(1)}</div>}
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="genre">{book.genre}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-books">No books found matching your criteria.</div>
        )}
      </div>
    </div>
  );
}

export default BrowseBooksPage;
