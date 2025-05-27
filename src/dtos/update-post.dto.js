// src/dtos/update-post.dto.js
const Joi = require('joi'); // Make sure this is at the top

const updatePostSchema = Joi.object({ // Line 6 would be around here
  title: Joi.string().min(3).max(255).optional().messages({
    'string.base': `"title" should be a type of 'text'`,
    'string.min': `"title" should have a minimum length of {#limit}`,
    'string.max': `"title" should have a maximum length of {#limit}`
  }),
  content: Joi.string().optional().allow(''),
  published: Joi.boolean().optional(),
  categoryId: Joi.number().integer().optional()
}).min(1); // Requires at least one field for an update

module.exports = updatePostSchema;