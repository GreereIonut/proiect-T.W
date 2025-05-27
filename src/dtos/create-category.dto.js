const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Category name is required.',
    'string.empty': 'Category name cannot be empty.',
  }),
});

module.exports = createCategorySchema;