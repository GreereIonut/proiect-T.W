const Joi = require('joi');

const postAuthorSchema = Joi.object({
    username: Joi.string().required()
});

const postCategorySchema = Joi.object({
    name: Joi.string().required()
});

const postResponseSchema = Joi.object({
    id: Joi.number().integer().required(),
    title: Joi.string().required(),
    content: Joi.string().allow(null, '').optional(),
    published: Joi.boolean().required(),
    createdAt: Joi.date().iso().required(),
    authorId: Joi.number().integer().required(),
    categoryId: Joi.number().integer().required(),
    author: postAuthorSchema.optional(),
    category: postCategorySchema.optional()
});

module.exports = postResponseSchema;