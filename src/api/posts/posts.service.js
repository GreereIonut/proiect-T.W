const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPosts = async (searchTerm, page = 1, pageSize = 10) => { // Default to page 1, 10 items per page
  console.log('Backend Service - Search term received:', searchTerm);
  console.log('Backend Service - Page received:', page);
  console.log('Backend Service - PageSize received:', pageSize);

  const whereClause = searchTerm
    ? {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
        ],
      }
    : {};
  console.log('Backend Service - Prisma whereClause:', JSON.stringify(whereClause));

  // Calculate skip value for pagination
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  // Get the total count of posts matching the whereClause
  const totalPosts = await prisma.post.count({
    where: whereClause,
  });

  // Get the paginated posts
  const posts = await prisma.post.findMany({
    where: whereClause,
    include: {
      author: { select: { username: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip: skip, // Skip records for previous pages
    take: take,   // Take only 'pageSize' records
  });

  return {
    posts,       // The posts for the current page
    totalPosts,  // Total number of posts matching the criteria
    totalPages: Math.ceil(totalPosts / pageSize), // Total number of pages
    currentPage: page // The current page number
  };
};

const getPostById = async (postId) => {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { username: true } },
      category: { select: { name: true } },
    },
  });
};

const createPost = async (postData, authorId) => {
  const { title, content, published, categoryId } = postData;
  return await prisma.post.create({
    data: { title, content, published: published || false, authorId, categoryId },
  });
};

const updatePost = async (postId, postData) => {
  const { title, content, published, categoryId } = postData;
  return await prisma.post.update({
    where: { id: postId },
    data: { title, content, published, categoryId },
  });
};

const deletePost = async (postId) => {
  return await prisma.post.delete({
    where: { id: postId },
  });
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };