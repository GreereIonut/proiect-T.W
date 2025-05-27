import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import App from './App.jsx';
import './index.css'; // Or your main CSS file
// In src/main.jsx or src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* AuthProvider wraps App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);