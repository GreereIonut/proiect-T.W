// This middleware uses Joi schemas passed to it for validation
function validationMiddleware(schema) {
  return async (req, res, next) => {
    try {
      // Validate req.body against the provided Joi schema
      // { abortEarly: false } ensures all validation errors are collected
      const validatedBody = await schema.validateAsync(req.body, { abortEarly: false });
      req.body = validatedBody; // Replace req.body with the validated (and potentially transformed) data
      next();
    } catch (error) {
      // If Joi validation fails, error.isJoi will be true
      if (error.isJoi) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
      }
      // For other unexpected errors
      console.error("Validation middleware error:", error);
      res.status(500).json({ message: "Internal server error during validation." });
    }
  };
}

module.exports = validationMiddleware;