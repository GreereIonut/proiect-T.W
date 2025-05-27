import React from 'react';
import { useAuth } from '../context/AuthContext'; // Optional: to display user info

function DashboardPage() {
  const { user } = useAuth(); // Example: Get user info from context

  return (
    <div>
      <h2>User Dashboard (Protected Route)</h2>
      {user ? (
        <p>Welcome, {user.username || 'User'}! Your role is: {user.role}</p>
      ) : (
        <p>Loading user data...</p>
      )}
      <p>This page is only visible to logged-in users.</p>
    </div>
  );
}

export default DashboardPage;