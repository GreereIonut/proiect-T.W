const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates a new category.
 * @param {object} categoryData - Object containing the name of the category.
 * @returns {Promise<object>} The newly created category object.
 */
const createCategory = async (categoryData) => {
  const { name } = categoryData;
  return await prisma.category.create({
    data: {
      name,
    },
  });
};

/**
 * Retrieves all categories.
 * @returns {Promise<Array<object>>} A list of all categories.
 */
const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
        name: 'asc' // Order alphabetically by name
    }
  });
};

/**
 * Retrieves a single category by its ID.
 * @param {number} categoryId - The ID of the category.
 * @returns {Promise<object|null>} The category object if found, otherwise null.
 */
const getCategoryById = async (categoryId) => {
  return await prisma.category.findUnique({
    where: { id: categoryId },
  });
};

/**
 * Updates an existing category.
 * @param {number} categoryId - The ID of the category to update.
 * @param {object} categoryData - Object containing the new name for the category.
 * @returns {Promise<object>} The updated category object.
 */
const updateCategory = async (categoryId, categoryData) => {
  const { name } = categoryData;
  return await prisma.category.update({
    where: { id: categoryId },
    data: { name },
  });
};

/**
 * Deletes a category by its ID.
 * @param {number} categoryId - The ID of the category to delete.
 * @returns {Promise<object>} The deleted category object.
 */
const deleteCategory = async (categoryId) => {
  // Note: Prisma will throw an error (P2003) if you try to delete a category
  // that is still linked by posts, due to foreign key constraints.
  // The controller handles this specific Prisma error.
  return await prisma.category.delete({
    where: { id: categoryId },
  });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};