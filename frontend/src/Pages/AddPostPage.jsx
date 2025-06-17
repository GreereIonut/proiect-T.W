import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './AddPostPage.css';

function AddBookPost() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    bookTitle: '',
    author: '',
    isbn: '',
    genre: '',
    review: '',
    rating: 5
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get('/posts');
        setPosts(response.data.posts || []);
      } catch (error) {
        setError('Failed to fetch book reviews. ' + error.message);
      }
    };
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.bookTitle.trim() || !newPost.author.trim() || !newPost.review.trim()) {
      setError('Book title, author, and review are required.');
      return;
    }

    try {
      const response = await apiClient.post('/posts', {
        title: `${newPost.bookTitle} by ${newPost.author}`,
        content: JSON.stringify(newPost)
      });
      setPosts([...posts, response.data]);
      setNewPost({
        bookTitle: '',
        author: '',
        isbn: '',
        genre: '',
        review: '',
        rating: 5
      });
      setSuccessMessage('Book review posted successfully!');
      navigate('/posts'); // Redirect to posts list after successful submission
    } catch (error) {
      setError('Failed to post book review. ' + error.message);
    }
  };

  return (
    <div className="book-review-container">
      <h2>Add Book Review</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <section className="add-book-review-section">
        <form onSubmit={handleSubmit} className="book-review-form">
          <div className="book-form-grid">
            <div className="form-group">
              <label htmlFor="bookTitle">Book Title*</label>
              <input
                type="text"
                id="bookTitle"
                name="bookTitle"
                value={newPost.bookTitle}
                onChange={handleInputChange}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author*</label>
              <input
                type="text"
                id="author"
                name="author"
                value={newPost.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={newPost.isbn}
                onChange={handleInputChange}
                placeholder="Enter ISBN (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                name="genre"
                value={newPost.genre}
                onChange={handleInputChange}
              >
                <option value="">Select a genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Horror">Horror</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Self-Help">Self-Help</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                name="rating"
                value={newPost.rating}
                onChange={handleInputChange}
              >
                <option value="5">★★★★★ (5/5)</option>
                <option value="4">★★★★☆ (4/5)</option>
                <option value="3">★★★☆☆ (3/5)</option>
                <option value="2">★★☆☆☆ (2/5)</option>
                <option value="1">★☆☆☆☆ (1/5)</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="review">Book Review*</label>
            <textarea
              id="review"
              name="review"
              value={newPost.review}
              onChange={handleInputChange}
              placeholder="Write your review here..."
              rows="6"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-review-btn">
            Post Review
          </button>
        </form>
      </section>
    </div>
  );
}

export default AddBookPost;