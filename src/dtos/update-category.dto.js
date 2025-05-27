const Joi = require('joi');

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
}).min(1);

module.exports = updateCategorySchema;