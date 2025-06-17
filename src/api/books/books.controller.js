const booksService = require('./books.service');

async function getAllBooks(req, res) {
    try {
        const { genre, sort, search } = req.query;
        const books = await booksService.getAllBooks({ genre, sort, search });
        res.json({ books });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
}

async function getMyBooks(req, res) {
    try {
        const userId = req.user.id;
        const books = await booksService.getMyBooks(userId);
        res.json({ books });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your books' });
    }
}

async function getBookById(req, res) {
    try {
        const { id } = req.params;
        
        try {
            const book = await booksService.getBookById(id);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json(book);
        } catch (err) {
            if (err.message === 'Invalid book ID') {
                return res.status(400).json({ error: 'Invalid book ID format' });
            }
            throw err;
        }
    } catch (error) {
        console.error('Error getting book:', error);
        res.status(500).json({ error: 'Failed to fetch book details' });
    }
}

async function createBook(req, res) {
    try {
        const bookData = req.body;
        const userId = req.user.id; // Get the user ID from the authenticated request

        if (!bookData.title || !bookData.author || !bookData.genre) {
            return res.status(400).json({ error: 'Title, author, and genre are required' });
        }

        try {
            const newBook = await booksService.createBook(bookData, userId);
            res.status(201).json(newBook);
        } catch (error) {
            console.error('Error creating book:', error);
            res.status(500).json({ error: 'Failed to create book: ' + error.message });
        }
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Failed to create book: ' + error.message });
    }
}

async function updateBook(req, res) {
    try {
        const { id } = req.params;
        const bookData = req.body;
        const updatedBook = await booksService.updateBook(id, bookData);
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
}

async function deleteBook(req, res) {
    try {
        const { id } = req.params;
        await booksService.deleteBook(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
}

async function getBookReviews(req, res) {
    try {
        const { id } = req.params;
        const reviews = await booksService.getBookReviews(id);
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book reviews' });
    }
}

async function addBookReview(req, res) {
    try {
        const { id } = req.params;
        const reviewData = req.body;
        const userId = req.user.id; // From auth middleware
        const review = await booksService.addBookReview(id, userId, reviewData);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add review' });
    }
}

async function getRecommendations(req, res) {
    try {
        const recommendations = await booksService.getRecommendations();
        res.json({ recommendations });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ 
            error: 'Failed to fetch recommendations',
            message: error.message 
        });
    }
}

module.exports = {
    getAllBooks,
    getMyBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getBookReviews,
    addBookReview,
    getRecommendations
};
