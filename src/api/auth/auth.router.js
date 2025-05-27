const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const validationMiddleware = require('../../middleware/validation.middleware');
const registerUserSchema = require('../../dtos/register-user.dto');
const loginUserSchema = require('../../dtos/login-user.dto');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication and registration
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully!
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad request (validation error).
 *       '409':
 *         description: Conflict (user already exists).
 *       '500':
 *         description: Internal server error.
 */
router.post('/register', validationMiddleware(registerUserSchema), authController.registerController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in an existing user
 *     description: Authenticates a user and returns a JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       '200':
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized (invalid credentials).
 *       '500':
 *         description: Internal server error.
 */
router.post('/login', validationMiddleware(loginUserSchema), authController.loginController);

module.exports = router;