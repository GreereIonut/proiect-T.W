const express = require('express');
const router = express.Router();
const postsController = require('./posts.controller');
const authenticateToken = require('../../middleware/authMiddleware');
const validationMiddleware = require('../../middleware/validation.middleware');
const createPostSchema = require('../../dtos/create-post.dto');
const updatePostSchema = require('../../dtos/update-post.dto');

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: API to manage blog posts.
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Retrieve a list of all posts
 *     responses:
 *       '200':
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostResponse'
 */
router.get('/', postsController.getAllPostsController);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Retrieve a single post by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Details of the post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       '404':
 *         description: Post not found.
 */
router.get('/:id', postsController.getPostByIdController);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       '201':
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       '400':
 *         description: Bad request (validation error).
 *       '401':
 *         description: Unauthorized.
 */
router.post(
    '/',
    authenticateToken,
    validationMiddleware(createPostSchema),
    postsController.createPostController
);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Update an existing post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostInput'
 *     responses:
 *       '200':
 *         description: Post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       '400':
 *         description: Bad request (validation error).
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Post not found.
 */
router.put(
    '/:id',
    authenticateToken,
    validationMiddleware(updatePostSchema),
    postsController.updatePostController
);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Post deleted successfully.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Post not found.
 */
router.delete('/:id', authenticateToken, postsController.deletePostController);

module.exports = router;