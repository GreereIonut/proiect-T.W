import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import './AddPostPage.css'; // Add a custom CSS file for styling

function AddPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [publishImmediately, setPublishImmediately] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories');
        setCategories(response.data || []);
      } catch (err) {
        setError('Failed to fetch categories.');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title || !content || !selectedCategory) {
      setError('All fields are required.');
      return;
    }

    try {
      await apiClient.post('/posts', {
        title,
        content,
        categoryId: selectedCategory,
        published: publishImmediately,
      });
      setSuccessMessage('Post created successfully!');
      setTimeout(() => navigate('/posts'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    }
  };

  return (
    <div className="container-centered">
      <h2>Create New Post</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formPostTitle">
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPostContent">
          <Form.Label>Content:</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPostCategory">
          <Form.Label>Category:</Form.Label>
          {categories.length > 0 ? (
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          ) : (
            <p className="text-danger">No categories available. Please create a category first.</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPostPublish">
          <Form.Check
            type="checkbox"
            label="Publish immediately"
            checked={publishImmediately}
            onChange={(e) => setPublishImmediately(e.target.checked)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Create Post
        </Button>
      </Form>
    </div>
  );
}

export default AddPostPage;