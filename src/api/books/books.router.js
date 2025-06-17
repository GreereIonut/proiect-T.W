const express = require('express');
const router = express.Router();
const booksController = require('./books.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validationMiddleware = require('../../middleware/validation.middleware');
const { createBookSchema, updateBookSchema, createReviewSchema } = require('../../dtos/book.dto');

// Public routes
router.get('/', booksController.getAllBooks);
router.get('/recommendations', booksController.getRecommendations); // Must be before :id but after fixed routes
router.get('/mybooks', authMiddleware, booksController.getMyBooks);
router.get('/:id', booksController.getBookById);
router.get('/:id/reviews', booksController.getBookReviews);

// Protected routes - require authentication
router.post('/', authMiddleware, validationMiddleware(createBookSchema), booksController.createBook);
router.put('/:id', authMiddleware, validationMiddleware(updateBookSchema), booksController.updateBook);
router.delete('/:id', authMiddleware, booksController.deleteBook);
router.post('/:id/reviews', authMiddleware, validationMiddleware(createReviewSchema), booksController.addBookReview);

module.exports = router;
