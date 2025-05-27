const express = require('express');

// Routers
const cors = require('cors');
const authRouter = require('./api/auth/auth.router');
const postsRouter = require('./api/posts/posts.router');
const categoriesRouter = require('./api/categories/categories.router');

// Swagger

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerConfig'); // Path from src/app.js up to root

const app = express();

app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from your Vite frontend
  // You can also specify other options like methods, headers, etc.
  // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Global Middleware
app.use(express.json());



// API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/categories', categoriesRouter);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Blog API!',
    documentation: `http://localhost:${process.env.PORT || 8000}/api-docs`
  });
});

// Global Error Handler (basic example)
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack || err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
});

module.exports = app;