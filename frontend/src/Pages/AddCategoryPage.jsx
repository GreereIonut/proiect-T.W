import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

function AddCategoryPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      await apiClient.post('/categories', { name });
      setSuccessMessage('Category created successfully!');
      setTimeout(() => navigate('/categories'), 2000); // Redirect to categories list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Category</h2>
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="categoryName" style={{ display: 'block', marginBottom: '5px' }}>Category Name:</label>
          <input
            id="categoryName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Create Category
        </button>
      </form>
    </div>
  );
}

export default AddCategoryPage;