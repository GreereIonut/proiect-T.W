const express = require('express');
const router = express.Router();
const categoriesController = require('./categories.controller');
const authenticateToken = require('../../middleware/authMiddleware');
const validationMiddleware = require('../../middleware/validation.middleware');
const createCategorySchema = require('../../dtos/create-category.dto');
const updateCategorySchema = require('../../dtos/update-category.dto');

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: API for managing blog categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Retrieve a list of all categories
 *     description: Fetches a list of all categories, ordered by name.
 *     responses:
 *       '200':
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *       '500':
 *         description: Internal server error.
 */
router.get('/', categoriesController.getAllCategoriesController);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Retrieve a single category by ID
 *     description: Fetches a specific category by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numeric ID of the category to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Category details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       '400':
 *         description: Invalid Category ID.
 *       '404':
 *         description: Category not found.
 *       '500':
 *         description: Internal server error.
 */
router.get('/:id', categoriesController.getCategoryByIdController);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category (Admin only)
 *     description: Creates a new blog category. Requires Admin authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       '201':
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       '400':
 *         description: Bad request (e.g., validation error, name missing).
 *       '401':
 *         description: Unauthorized (token not provided or invalid).
 *       '403':
 *         description: Forbidden (User is not an Admin).
 *       '409':
 *         description: Conflict (Category name already exists).
 *       '500':
 *         description: Internal server error.
 */
router.post('/', authenticateToken, validationMiddleware(createCategorySchema), categoriesController.createCategoryController);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update an existing category (Admin only)
 *     description: Updates an existing blog category. Requires Admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numeric ID of the category to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryInput'
 *     responses:
 *       '200':
 *         description: Category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       '400':
 *         description: Bad request (e.g., validation error, name missing).
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden (User is not an Admin).
 *       '404':
 *         description: Category not found.
 *       '409':
 *         description: Conflict (Another category with this name already exists).
 *       '500':
 *         description: Internal server error.
 */
router.put('/:id', authenticateToken, validationMiddleware(updateCategorySchema), categoriesController.updateCategoryController);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category (Admin only)
 *     description: Deletes an existing blog category. Requires Admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numeric ID of the category to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Category deleted successfully (No Content).
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden (User is not an Admin).
 *       '404':
 *         description: Category not found.
 *       '409':
 *         description: Conflict (Category is associated with posts).
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:id', authenticateToken, categoriesController.deleteCategoryController);

module.exports = router;