import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
      rating: 4.5,
      genre: "Fiction"
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
      rating: 4.8,
      genre: "Science Fiction"
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
      rating: 4.7,
      genre: "Self-Help"
    }
  ];

  const categories = [
    { name: "Fiction", icon: "📚" },
    { name: "Mystery", icon: "🔍" },
    { name: "Science Fiction", icon: "🚀" },
    { name: "Romance", icon: "💝" },
    { name: "Non-Fiction", icon: "📖" },
    { name: "Biography", icon: "👤" }
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to BookReads</h1>
          <p>Discover your next favorite book</p>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
        </div>
      </section>

      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="book-grid">
          {featuredBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                <img src={book.coverUrl} alt={book.title} />
                <div className="book-rating">★ {book.rating}</div>
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="genre">{book.genre}</p>
                <Link to={`/books/${book.id}`} className="view-book-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link to={`/categories/${category.name.toLowerCase()}`} key={index} className="category-card">
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Join Our Community</h2>
        <p>Share your thoughts, discover new books, and connect with fellow readers.</p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-button primary">Sign Up Now</Link>
          <Link to="/about" className="cta-button secondary">Learn More</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;