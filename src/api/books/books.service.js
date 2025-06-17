const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllBooks({ genre, sort, search }) {
    const where = {};
    const orderBy = {};

    // Add genre filter if provided
    if (genre) {
        where.genre = genre;
    }

    // Add search filter if provided
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
            { isbn: { contains: search } }
        ];
    }

    // Add sorting
    if (sort) {
        switch (sort) {
            case 'title':
                orderBy.title = 'asc';
                break;
            case '-title':
                orderBy.title = 'desc';
                break;
            case 'rating':
                orderBy.averageRating = 'desc';
                break;
            case '-rating':
                orderBy.averageRating = 'asc';
                break;
            case 'date':
                orderBy.createdAt = 'desc';
                break;
            case '-date':
                orderBy.createdAt = 'asc';
                break;
            default:
                orderBy.title = 'asc';
        }
    }

    return await prisma.book.findMany({
        where,
        orderBy,
        include: {
            reviews: {
                select: {
                    rating: true
                }
            }
        }
    });
}

async function getBookById(id) {
    // Handle case where id is not a valid number
    const bookId = Number(id);
    if (isNaN(bookId)) {
        throw new Error('Invalid book ID');
    }

    return await prisma.book.findUnique({
        where: { id: bookId },
        include: {
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            }
        }
    });
}

async function createBook(bookData, userId) {
    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.genre) {
        throw new Error('Title, author, and genre are required');
    }

    // Clean up the book data
    const cleanBookData = {
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        isbn: bookData.isbn?.trim() || null,
        description: bookData.description?.trim() || null,
        coverUrl: bookData.coverUrl?.trim() || null,
        genre: bookData.genre.trim(),
        published: bookData.published || null,
        totalPages: bookData.totalPages ? parseInt(bookData.totalPages) : null,
        createdById: userId
    };

    return await prisma.book.create({
        data: cleanBookData,
        include: {
            reviews: true
        }
    });
}

async function updateBook(id, bookData) {
    return await prisma.book.update({
        where: { id: parseInt(id) },
        data: {
            ...bookData,
            categoryId: bookData.categoryId ? parseInt(bookData.categoryId) : undefined
        }
    });
}

async function deleteBook(id) {
    return await prisma.book.delete({
        where: { id: parseInt(id) }
    });
}

async function getBookReviews(id) {
    return await prisma.review.findMany({
        where: { bookId: parseInt(id) },
        include: {
            user: {
                select: {
                    id: true,
                    username: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

async function addBookReview(bookId, userId, reviewData) {
    // Start a transaction
    return await prisma.$transaction(async (prisma) => {
        // Create the review
        const review = await prisma.review.create({
            data: {
                ...reviewData,
                bookId: parseInt(bookId),
                userId: parseInt(userId)
            }
        });

        // Update book's average rating and total reviews
        const reviews = await prisma.review.findMany({
            where: { bookId: parseInt(bookId) }
        });

        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

        await prisma.book.update({
            where: { id: parseInt(bookId) },
            data: {
                averageRating,
                totalReviews
            }
        });

        return review;
    });
}

async function getRecommendations(userId = null) {
    try {
        // Get highly rated books first
        const baseRecommendations = await prisma.book.findMany({
            where: {
                rating: { gte: 3.5 },  // Using the rating field directly
                ratingCount: { gt: 0 } // Ensure some ratings exist
            },
            orderBy: [
                { rating: 'desc' },
                { ratingCount: 'desc' }
            ],
            take: 10,
            include: {
                category: true
            }
        });

        let personalizedRecommendations = [];

        // If we have a userId, add personalized recommendations
        if (userId) {
            try {
                // Get user's read books to exclude them
                const userReadBooks = await prisma.review.findMany({
                    where: { userId: parseInt(userId) },
                    select: { bookId: true }
                });

                const userReadBookIds = userReadBooks.map(review => review.bookId);

                // Get genres from books the user has rated highly
                const userPreferredGenres = await prisma.review.findMany({
                    where: { 
                        userId: parseInt(userId),
                        rating: { gte: 4 }
                    },
                    include: {
                        book: {
                            select: { genre: true }
                        }
                    }
                });

                const genres = [...new Set(userPreferredGenres
                    .map(review => review.book.genre)
                    .filter(genre => genre)
                )];

                if (genres.length > 0) {
                    personalizedRecommendations = await prisma.book.findMany({
                        where: {
                            genre: { in: genres },
                            NOT: { 
                                id: { in: userReadBookIds }
                            },
                            rating: { gte: 3.0 }  // Lower threshold for genre matches
                        },
                        orderBy: [
                            { rating: 'desc' },
                            { ratingCount: 'desc' }
                        ],
                        take: 5,
                        include: {
                            category: true
                        }
                    });
                }
            } catch (error) {
                console.error('Error getting personalized recommendations:', error);
                // Continue with base recommendations if personalization fails
            }
        }

        // Combine and deduplicate recommendations
        const allRecommendations = [...baseRecommendations];
        
        // Only add personalized recommendations that aren't in base recommendations
        for (const book of personalizedRecommendations) {
            if (!allRecommendations.some(b => b.id === book.id)) {
                allRecommendations.push(book);
            }
        }

    return allRecommendations;
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        return []; // Return empty array instead of throwing
    }
}

// Get books created by a specific user
async function getMyBooks(userId) {
    try {
        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            throw new Error('Invalid user ID');
        }

        const result = await prisma.book.findMany({
            where: {
                createdById: parsedUserId
            },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return result;
    } catch (error) {
        console.error('Error in getMyBooks:', error);
        throw error;
    }
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getBookReviews,    addBookReview,
    getRecommendations,
    getMyBooks
};
