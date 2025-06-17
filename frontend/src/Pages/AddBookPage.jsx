import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './AddBookPage.css';

function AddBookPage() {    
    const [book, setBook] = useState({
        title: '',
        author: '',
        isbn: '',
        description: '',
        coverUrl: '',
        genre: '',
        published: '',
        totalPages: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
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
        "Poetry",
        "Children's",
        "Young Adult",
        "Self-Help",
        "Business"
    ];
    
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBook(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!book.title.trim() || !book.author.trim() || !book.genre) {
            setError('Title, author, and genre are required.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post('/books', book);
            setSuccess('Book added successfully!');
            setTimeout(() => {
                navigate(`/books/${response.data.id}`);
            }, 1500);
        } catch (error) {
            setError('Failed to add book. ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-book-container">
            <h2>Add New Book</h2>
            
            <form onSubmit={handleSubmit} className="book-form">
                {success && <div className="success-message">{success}</div>}
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="title">Book Title*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={book.title}
                        onChange={handleInputChange}
                        placeholder="Enter book title"
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author*</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={book.author}
                        onChange={handleInputChange}
                        placeholder="Enter author name"
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="isbn">ISBN</label>
                    <input
                        type="text"
                        id="isbn"
                        name="isbn"
                        value={book.isbn}
                        onChange={handleInputChange}
                        placeholder="Enter ISBN (optional)"
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="genre">Genre*</label>
                    <select
                        id="genre"
                        name="genre"
                        value={book.genre}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a genre</option>
                        {genres.map(genre => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="totalPages">Total Pages</label>
                    <input
                        type="number"
                        id="totalPages"
                        name="totalPages"
                        value={book.totalPages}
                        onChange={handleInputChange}
                        placeholder="Enter total pages (optional)"
                        min="1"
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="published">Publication Date</label>
                    <input
                        type="date"
                        id="published"
                        name="published"
                        value={book.published}
                        onChange={handleInputChange}
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="coverUrl">Cover Image URL</label>
                    <input
                        type="url"
                        id="coverUrl"
                        name="coverUrl"
                        value={book.coverUrl}
                        onChange={handleInputChange}
                        placeholder="Enter cover image URL (optional)"
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={book.description}
                        onChange={handleInputChange}
                        placeholder="Enter book description (optional)"
                        rows="4"
                        autoComplete="off"
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? 'Adding Book...' : 'Add Book'}
                </button>
            </form>
        </div>
    );
}

export default AddBookPage;
