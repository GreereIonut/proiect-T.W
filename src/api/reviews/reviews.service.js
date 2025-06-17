const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllReviews({ filter, sort }) {
    try {
        const where = {};
        let orderBy = [];

        // Handle filters
        if (filter === 'top-rated') {
            orderBy = [
                { rating: 'desc' },
                { createdAt: 'desc' }
            ];
        } else if (filter === 'recent') {
            orderBy = [
                { createdAt: 'desc' }
            ];
        } else {
            // Default sorting
            orderBy = [
                { createdAt: 'desc' }
            ];
        }

        // Custom sort overrides if provided
        if (sort) {
            orderBy = [];
            switch (sort) {
                case 'rating':
                    orderBy.push({ rating: 'desc' }, { createdAt: 'desc' });
                    break;
                case '-rating':
                    orderBy.push({ rating: 'asc' }, { createdAt: 'desc' });
                    break;
                case 'date':
                    orderBy.push({ createdAt: 'desc' });
                    break;
                case '-date':
                    orderBy.push({ createdAt: 'asc' });
                    break;
                default:
                    orderBy.push({ createdAt: 'desc' });
            }
        }

        const reviews = await prisma.review.findMany({
            where,
            orderBy,
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        coverUrl: true,
                        category: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        return reviews;
    } catch (error) {
        console.error('Error in getAllReviews:', error);
        throw error;
    }
}

async function getRecentReviews() {
    return await prisma.review.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 10,
        include: {
            book: {
                select: {
                    id: true,
                    title: true,
                    author: true,
                    coverUrl: true
                }
            },
            user: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });
}

async function getReviewById(id) {
    return await prisma.review.findUnique({
        where: { id: parseInt(id) },
        include: {
            book: true,
            user: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });
}

async function createReview(reviewData) {
    return await prisma.review.create({
        data: {
            ...reviewData,
            bookId: parseInt(reviewData.bookId),
            userId: parseInt(reviewData.userId)
        },
        include: {
            book: true,
            user: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });
}

async function updateReview(id, reviewData, userId) {
    // First check if the review belongs to the user
    const existingReview = await prisma.review.findFirst({
        where: {
            id: parseInt(id),
            userId: parseInt(userId)
        }
    });

    if (!existingReview) {
        return null;
    }

    return await prisma.review.update({
        where: { id: parseInt(id) },
        data: reviewData,
        include: {
            book: true,
            user: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });
}

async function deleteReview(id, userId) {
    // First check if the review belongs to the user
    const existingReview = await prisma.review.findFirst({
        where: {
            id: parseInt(id),
            userId: parseInt(userId)
        }
    });

    if (!existingReview) {
        throw new Error('Review not found or unauthorized');
    }

    return await prisma.review.delete({
        where: { id: parseInt(id) }
    });
}

module.exports = {
    getAllReviews,
    getRecentReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
};
