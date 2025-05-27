import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';

function PostsListPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input
  const [searchQuery, setSearchQuery] = useState(''); // State to trigger fetch with search

  // useCallback to memoize fetchPosts, so it can be a dependency of useEffect
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // Append search query if it exists
      const url = searchQuery ? `/posts?search=${encodeURIComponent(searchQuery)}` : '/posts';
      const response = await apiClient.get(url);
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.response?.data?.message || 'Failed to fetch posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]); // Re-fetch when searchQuery changes

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // fetchPosts is now a stable dependency

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchTerm); // This will trigger the useEffect to re-fetch posts
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>All Blog Posts</h2>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px' }}>Search</button>
      </form>

      {posts.length === 0 && !isLoading && (
        <div>No posts found for "{searchQuery}".</div>
      )}

      {posts.length > 0 && (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.author ? post.author.username : 'N/A'}</td>
                <td>{post.category ? post.category.name : 'N/A'}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>{post.published ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PostsListPage;