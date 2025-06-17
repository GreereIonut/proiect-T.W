const reviewsService = require('./reviews.service');

async function getAllReviews(req, res) {
    try {
        const { filter, sort } = req.query;
        console.log('Fetching reviews with filter:', filter);
        
        const reviews = await reviewsService.getAllReviews({ filter, sort });
        
        console.log(`Found ${reviews.length} reviews`);
        res.json({ reviews });
    } catch (error) {
        console.error('Error in getAllReviews:', error);
        res.status(500).json({ 
            error: 'Failed to fetch reviews',
            message: error.message 
        });
    }
}

async function getRecentReviews(req, res) {
    try {
        const reviews = await reviewsService.getRecentReviews();
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent reviews' });
    }
}

async function getReviewById(req, res) {
    try {
        const { id } = req.params;
        const review = await reviewsService.getReviewById(id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch review' });
    }
}

async function createReview(req, res) {
    try {
        const reviewData = req.body;
        const userId = req.user.id;
        const review = await reviewsService.createReview({ ...reviewData, userId });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create review' });
    }
}

async function updateReview(req, res) {
    try {
        const { id } = req.params;
        const reviewData = req.body;
        const userId = req.user.id;
        const review = await reviewsService.updateReview(id, reviewData, userId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update review' });
    }
}

async function deleteReview(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await reviewsService.deleteReview(id, userId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
}

module.exports = {
    getAllReviews,
    getRecentReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
};
