const Joi = require('joi');

const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  content: Joi.string().optional().allow(''),
  published: Joi.boolean().optional(),
  categoryId: Joi.number().integer().optional()
}).min(1); // Requires at least one field for an update

module.exports = updatePostSchema;