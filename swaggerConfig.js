const swaggerJsdoc = require('swagger-jsdoc');
const generatedSchemas = require('./src/config/swaggerSchemas');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My Blog API',
      version: '1.0.0',
      description: 'API for a blog application, built with Node.js, Express, and Prisma.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: generatedSchemas, // Include schemas here
    },
    tags: [
      { name: 'Auth', description: 'User authentication and registration' },
      { name: 'Posts', description: 'API for managing blog posts' },
      { name: 'Categories', description: 'API for managing categories' },
    ],
  },
  apis: ['./src/api/**/*.router.js'], // Include all router files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;