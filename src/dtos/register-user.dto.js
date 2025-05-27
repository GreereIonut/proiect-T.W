const Joi = require('joi');

const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'any.required': 'Username is required.',
    'string.empty': 'Username cannot be empty.',
    'string.min': 'Username must be at least 3 characters long.',
    'string.max': 'Username cannot be more than 30 characters long.',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required.',
    'string.empty': 'Email cannot be empty.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password is required.',
    'string.empty': 'Password cannot be empty.',
    'string.min': 'Password must be at least 6 characters long.',
  }),
});

module.exports = registerUserSchema;