const express = require('express');
const router = express.Router();
const reviewsController = require('./reviews.controller');
const authMiddleware = require('../../middleware/authMiddleware');

// Public routes
// Route for all reviews with optional filter parameter
router.get('/', reviewsController.getAllReviews);
router.get('/:id', reviewsController.getReviewById);

// Protected routes
router.post('/', authMiddleware, reviewsController.createReview);
router.put('/:id', authMiddleware, reviewsController.updateReview);
router.delete('/:id', authMiddleware, reviewsController.deleteReview);

module.exports = router;
