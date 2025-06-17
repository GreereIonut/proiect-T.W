const Joi = require('joi');

const createBookSchema = Joi.object({
    title: Joi.string().required().min(1).max(255),
    author: Joi.string().required().min(1).max(255),
    isbn: Joi.string().optional().allow('').max(13),
    description: Joi.string().optional().allow(''),
    coverUrl: Joi.string().uri().optional().allow(''),
    genre: Joi.string().optional(),
    published: Joi.date().optional(),
    categoryId: Joi.number().required(),
    tags: Joi.array().items(Joi.number()).optional()
});

const updateBookSchema = Joi.object({
    title: Joi.string().optional().min(1).max(255),
    author: Joi.string().optional().min(1).max(255),
    isbn: Joi.string().optional().allow('').max(13),
    description: Joi.string().optional().allow(''),
    coverUrl: Joi.string().uri().optional().allow(''),
    genre: Joi.string().optional(),
    published: Joi.date().optional(),
    categoryId: Joi.number().optional(),
    tags: Joi.array().items(Joi.number()).optional()
});

const createReviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    content: Joi.string().required().min(10),
});

module.exports = {
    createBookSchema,
    updateBookSchema,
    createReviewSchema
};
