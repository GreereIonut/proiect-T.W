import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

function NavBar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    📚 BookReads
                </Link>

                <div className="nav-sections">
                    <div className="nav-links">
                        <Link 
                            to="/books" 
                            className={`nav-link ${isActive('/books') ? 'active' : ''}`}
                        >
                            Browse
                        </Link>
                        <Link 
                            to="/categories" 
                            className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
                        >
                            Categories
                        </Link>
                        <Link 
                            to="/reviews" 
                            className={`nav-link ${isActive('/reviews') ? 'active' : ''}`}
                        >
                            Reviews
                        </Link>
                        {isAuthenticated && (
                            <Link 
                                to="/my-books" 
                                className={`nav-link ${isActive('/my-books') ? 'active' : ''}`}
                            >
                                My Books
                            </Link>
                        )}
                    </div>

                    <div className="search-section">
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="search"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="auth-section">
                        {isAuthenticated ? (
                            <>
                                <Link to="/add-book" className="add-book-btn">
                                    Add Book
                                </Link>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="login-btn">
                                    Login
                                </Link>
                                <Link to="/register" className="register-btn">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;