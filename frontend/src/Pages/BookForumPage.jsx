import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './BookForumPage.css'; // Add a custom CSS file for styling

function BookForumPage() {
  const { bookId } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await apiClient.get(`/books/${bookId}`);
        setBook(response.data);
      } catch (err) {
        setError('Failed to fetch book details');
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await apiClient.get(`/books/${bookId}/posts`);
        setPosts(response.data.posts || []);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };

    fetchBookDetails();
    fetchPosts();
  }, [bookId]);

  const handleAddPost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await apiClient.post(`/books/${bookId}/posts`, { content: newPost });
      setPosts([...posts, response.data]);
      setNewPost('');
    } catch (err) {
      console.error('Failed to add post:', err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]?.trim()) return;

    try {
      const response = await apiClient.post(`/posts/${postId}/comments`, { content: newComment[postId] });
      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), response.data],
      });
      setNewComment({ ...newComment, [postId]: '' });
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="not-found">Book not found</div>;

  return (
    <div className="forum-container">
      <div className="book-details">
        <div className="book-cover">
          <img src={book.coverUrl} alt={book.title} />
        </div>
        <div className="book-info">
          <h1>{book.title}</h1>
          <h2>by {book.author}</h2>
          <div className="book-meta">
            <span className="genre">{book.genre}</span>
            <span className="rating">★ {book.rating.toFixed(1)}</span>
            <span className="isbn">ISBN: {book.isbn}</span>
          </div>
          <p className="description">{book.description}</p>
          <div className="action-buttons">
            <button className="btn-primary">Add to Reading List</button>
            <button className="btn-secondary">Write a Review</button>
          </div>
        </div>
      </div>

      <div className="forum-section">
        <h2>Book Discussions</h2>

        <section className="add-post-section">
          <h2>Create a New Post</h2>
          <textarea
            placeholder="Write your post here..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows="4"
          ></textarea>
          <button onClick={handleAddPost}>Add Post</button>
        </section>

        <section className="posts-section">
          <h2>Posts</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-item">
                <p>{post.content}</p>
                <div className="comments-section">
                  <h3>Comments</h3>
                  {comments[post.id]?.length > 0 ? (
                    comments[post.id].map((comment, index) => (
                      <div key={index} className="comment-item">
                        <p>{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )}
                  <textarea
                    placeholder="Write your comment here..."
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                    rows="2"
                  ></textarea>
                  <button onClick={() => handleAddComment(post.id)}>Add Comment</button>
                </div>
              </div>
            ))
          ) : (
            <p>No posts yet. Be the first to create one!</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default BookForumPage;