import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import './AddReviewPage.css';

function AddReviewPage() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        rating: 5,
        content: '',
        recommend: true
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchBookDetails = useCallback(async () => {
        try {
            const response = await apiClient.get(`/books/${bookId}`);
            setBook(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch book details. ' + err.message);
            setLoading(false);
        }
    }, [bookId]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookDetails();
    }, [user, navigate, fetchBookDetails]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim()) {
            setError('Please write a review before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.post(`/books/${bookId}/reviews`, {
                rating: formData.rating,
                content: formData.content,
                recommend: formData.recommend
            });
            navigate(`/books/${bookId}`);
        } catch (err) {
            setError('Failed to submit review. ' + err.message);
            setSubmitting(false);
        }
    };

    const handleRatingChange = (newRating) => {
        setFormData(prev => ({ ...prev, rating: newRating }));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading book details...</p>
            </div>
        );
    }

    return (
        <div className="add-review-page">
            {book && (
                <div className="review-container">
                    <div className="book-info">
                        <div className="book-cover">
                            {book.coverUrl ? (
                                <img src={book.coverUrl} alt={book.title} />
                            ) : (
                                <div className="no-cover">No Cover</div>
                            )}
                        </div>
                        <div className="book-details">
                            <h2>{book.title}</h2>
                            <p className="author">by {book.author}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="rating-section">
                            <label>Your Rating</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star ${star <= formData.rating ? 'filled' : ''}`}
                                        onClick={() => handleRatingChange(star)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="review-section">
                            <label htmlFor="review">Your Review</label>
                            <textarea
                                id="review"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Write your review here... What did you like or dislike about the book?"
                                rows="8"
                                required
                            />
                        </div>

                        <div className="recommend-section">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.recommend}
                                    onChange={(e) => setFormData(prev => ({ ...prev, recommend: e.target.checked }))}
                                />
                                I recommend this book
                            </label>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => navigate(`/books/${bookId}`)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={submitting || !formData.content.trim()}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AddReviewPage;
