import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

function EditPostPage() {
  const { postId } = useParams(); // Get postId from URL parameters
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // To check permissions if needed on frontend

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [published, setPublished] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        // setError("Could not load categories."); // Don't overwrite post loading error
      }
    };
    fetchCategories();
  }, []);

  // Fetch the post to edit
  const fetchPostToEdit = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/posts/${postId}`);
      const postData = response.data;
      setTitle(postData.title);
      setContent(postData.content || '');
      setCategoryId(postData.categoryId.toString()); // Ensure it's a string for select value
      setPublished(postData.published);
    } catch (err) {
      console.error("Failed to fetch post for editing:", err);
      setError(err.response?.data?.message || "Failed to load post data. It might not exist or you don't have permission.");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPostToEdit();
    }
  }, [postId, fetchPostToEdit]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title || !categoryId) {
      setError('Title and Category are required.');
      return;
    }

    const updatedPostData = {
      title,
      content,
      published,
      categoryId: parseInt(categoryId, 10),
    };

    try {
      // apiClient will send the JWT token automatically
      const response = await apiClient.put(`/posts/${postId}`, updatedPostData);
      setSuccessMessage('Post updated successfully! Redirecting...');
      console.log('Post updated:', response.data);

      setTimeout(() => {
        navigate('/posts'); // Or navigate(`/posts/${postId}`) to view the updated post
      }, 1500);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Failed to update post. Please try again.');
      }
      console.error('Update post error:', err.response || err.message);
    }
  };

  if (!isAuthenticated) { // Should be caught by ProtectedRoute, but as a fallback
    navigate('/login');
    return null; 
  }

  if (isLoading) {
    return <div>Loading post data...</div>;
  }

  if (error && !title) { // If there was an error fetching initial post data
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          {categories.length > 0 ? (
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
        <div>
          <label htmlFor="published">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPostPage;