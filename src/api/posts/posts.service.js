const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPosts = async () => {
  return await prisma.post.findMany({
    include: {
      author: { select: { username: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
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