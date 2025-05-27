const postsService = require('./posts.service');

const getAllPostsController = async (req, res) => {
  try {
    const { search, page, pageSize } = req.query;

    // Convert page and pageSize to numbers, provide defaults
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 10; // Default to 10 items per page

    console.log('Backend Controller - Search term received:', search);
    console.log('Backend Controller - Page received:', pageNum);
    console.log('Backend Controller - PageSize received:', pageSizeNum);

    // Pass search term, page number, and page size to the service
    const result = await postsService.getAllPosts(search, pageNum, pageSizeNum);
    
    res.status(200).json(result); // Send back the object containing posts and pagination info
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

const getPostByIdController = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Invalid Post ID.' });

    const post = await postsService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

const createPostController = async (req, res) => {
  try {
    const authorId = req.user.userId; // From authenticateToken middleware
    const newPost = await postsService.createPost(req.body, authorId);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    if (error.code === 'P2003') { // Foreign key constraint (e.g. categoryId doesn't exist)
        return res.status(400).json({ message: 'Invalid categoryId or other relational issue.' });
    }
    res.status(500).json({ message: 'Error creating post' });
  }
};

const updatePostController = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Invalid Post ID.' });

    const { userId, role } = req.user; // From authenticateToken middleware

    const postToUpdate = await postsService.getPostById(postId); // Use service to get post
    if (!postToUpdate) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (postToUpdate.authorId !== userId && role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to update this post.' });
    }

    const updatedPost = await postsService.updatePost(postId, req.body);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Invalid categoryId or other relational issue during update.' });
    } else if (error.code === 'P2025'){ // Record to update not found by Prisma
        return res.status(404).json({ message: 'Post not found for update.' });
    }
    res.status(500).json({ message: 'Error updating post' });
  }
};

const deletePostController = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Invalid Post ID.' });

    const { userId, role } = req.user; // From authenticateToken middleware

    const postToDelete = await postsService.getPostById(postId); // Use service to get post
    if (!postToDelete) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (postToDelete.authorId !== userId && role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this post.' });
    }

    await postsService.deletePost(postId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    if (error.code === 'P2025'){ // Record to delete not found by Prisma
        return res.status(404).json({ message: 'Post not found for deletion.' });
    }
    res.status(500).json({ message: 'Error deleting post' });
  }
};

module.exports = {
  getAllPostsController,
  getPostByIdController,
  createPostController,
  updatePostController,
  deletePostController,
};