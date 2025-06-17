import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './MyBooksPage.css';

function MyBooksPage() {
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const [filterStatus, setFilterStatus] = useState('all');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMyBooks();
    }, [user, navigate]);

    const fetchMyBooks = async () => {
        try {
            const response = await apiClient.get('/books/mybooks');
            setMyBooks(response.data.books || []);
            setLoading(false);
            setError(''); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch your books. ' + err.message);
            setLoading(false);
        }
    };

    const updateReadingStatus = async (bookId, status) => {
        try {
            await apiClient.patch(`/books/${bookId}/status`, { status });
            fetchMyBooks(); // Refresh the books list
        } catch (error) {
            setError('Failed to update book status.');
        }
    };

    const filteredBooks = filterStatus === 'all' 
        ? myBooks 
        : myBooks.filter(book => book.status === filterStatus);

    const renderRating = (rating) => {
        return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your books...</p>
            </div>
        );
    }

    return (
        <div className="my-books-page">
            <div className="my-books-header">
                <h1>My Books</h1>
                <div className="controls">
                    <div className="view-toggle">
                        <button 
                            className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                            onClick={() => setView('grid')}
                        >
                            Grid
                        </button>
                        <button 
                            className={`view-btn ${view === 'list' ? 'active' : ''}`}
                            onClick={() => setView('list')}
                        >
                            List
                        </button>
                    </div>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Books</option>
                        <option value="reading">Currently Reading</option>
                        <option value="completed">Completed</option>
                        <option value="want-to-read">Want to Read</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className={`books-container ${view}`}>
                {filteredBooks.length === 0 ? (
                    <div className="no-books">
                        <p>You haven't added any books yet.</p>
                        <Link to="/browse" className="browse-books-btn">Browse Books</Link>
                    </div>
                ) : (
                    filteredBooks.map(book => (
                        <div key={book.id} className="book-item">
                            <div className="book-cover">
                                {book.coverUrl ? (
                                    <img src={book.coverUrl} alt={book.title} />
                                ) : (
                                    <div className="no-cover">No Cover</div>
                                )}
                            </div>
                            <div className="book-details">
                                <h3>{book.title}</h3>
                                <p className="author">{book.author}</p>
                                {book.rating > 0 && (
                                    <div className="rating">
                                        {renderRating(book.rating)}
                                    </div>
                                )}
                                <div className="status-controls">
                                    <select
                                        value={book.status || 'want-to-read'}
                                        onChange={(e) => updateReadingStatus(book.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="want-to-read">Want to Read</option>
                                        <option value="reading">Currently Reading</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="book-actions">
                                    <Link 
                                        to={`/books/${book.id}`} 
                                        className="view-details-btn"
                                    >
                                        View Details
                                    </Link>
                                    <Link 
                                        to={`/add-review/${book.id}`} 
                                        className="add-review-btn"
                                    >
                                        Add Review
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const AddBookPage = () => {
  const genres = [
    "Fiction",
    "Non-Fiction", 
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Thriller",
    "Horror",
    "Biography",
    "History",
    "Science",
    "Poetry"
  ];

  return (
    <div className="add-book-container">
      <h1>Add New Book</h1>
      <form className="book-form" onSubmit={handleSubmit}>
        {/* ...existing title and author fields... */}

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select 
            id="genre"
            name="genre"
            className="form-select"
            required
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* ...existing ISBN and cover URL fields... */}

        {/* Removed category field */}

        <div className="form-actions">
          <button type="button" className="btn-cancel">Cancel</button>
          <button type="submit" className="btn-submit">Add Book</button>
        </div>
      </form>
    </div>
  );
};

export default MyBooksPage;
