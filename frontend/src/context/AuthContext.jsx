import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Make sure to install: npm install jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // To store user data like id, role, username
  const [isLoading, setIsLoading] = useState(true); // To prevent rendering until auth check is done

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token expired
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // Token is valid
          setUser({ 
            id: decodedToken.userId, 
            username: decodedToken.username, 
            role: decodedToken.role 
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decoding token on initial load:", error);
        localStorage.removeItem('authToken'); // Clear invalid token
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setIsLoading(false); // Finished initial auth check
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    try {
      const decodedToken = jwtDecode(token);
      setUser({ 
        id: decodedToken.userId,
        username: decodedToken.username,
        role: decodedToken.role 
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error decoding token on login:", error);
      // Potentially clear token and set auth to false if decode fails
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    // You might want to navigate to '/login' here, using useNavigate if you pass it down or handle in component
  };
  
  // Don't render children until loading is complete to avoid UI flashes or incorrect auth state display
  if (isLoading) {
    return <div>Loading application state...</div>; // Or a proper loading spinner component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the AuthContext in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};