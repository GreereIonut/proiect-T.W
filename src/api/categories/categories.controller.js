const categoriesService = require('./categories.service');

// Controller to create a new category (Admin only)
const createCategoryController = async (req, res) => {
  try {
    // Assuming authenticateToken middleware has run and set req.user
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only admins can create categories.' });
    }

    const { name } = req.body;
    // Validation for 'name' is handled by Joi DTO if validationMiddleware is used
    // but a basic check can remain if middleware isn't used for a specific reason.
    // if (!name) { // This check is ideally handled by the DTO
    // return res.status(400).json({ message: 'Category name is required.' });
    // }

    const newCategory = await categoriesService.createCategory({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(409).json({ message: 'A category with this name already exists.' });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ message: 'Error creating category.' });
  }
};

// Controller to get all categories (Public)
const getAllCategoriesController = async (req, res) => {
  try {
    const { search, page, pageSize } = req.query;

    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 10;

    console.log('CATEGORIES Controller - Search:', search, 'Page:', pageNum, 'PageSize:', pageSizeNum);

    const result = await categoriesService.getAllCategories(search, pageNum, pageSizeNum);
    
    res.status(200).json(result); // Send back the object containing categories and pagination info
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: 'Error fetching categories.' });
  }
};

// Controller to get a single category by ID (Public)
const getCategoryByIdController = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid Category ID." });
    }

    const category = await categoriesService.getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: 'Error fetching category.' });
  }
};

// Controller to update a category (Admin only)
const updateCategoryController = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only admins can update categories.' });
    }

    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid Category ID." });
    }

    const { name } = req.body;
    // if (!name) { // This check is ideally handled by the DTO
    // return res.status(400).json({ message: 'Category name is required for update.' });
    // }

    const existingCategory = await categoriesService.getCategoryById(categoryId);
    if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found.' });
    }

    const updatedCategory = await categoriesService.updateCategory(categoryId, { name });
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(409).json({ message: 'Another category with this name already exists.' });
    }
    console.error("Error updating category:", error);
    res.status(500).json({ message: 'Error updating category.' });
  }
};

// Controller to delete a category (Admin only)
const deleteCategoryController = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Only admins can delete categories.' });
    }

    const categoryId = parseInt(req.params.id);
     if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid Category ID." });
    }

    const existingCategory = await categoriesService.getCategoryById(categoryId);
    if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found.' });
    }
    
    await categoriesService.deleteCategory(categoryId);
    res.status(204).send();
  } catch (error) {
    // Prisma error P2003: Foreign key constraint failed (category is linked to posts)
    if (error.code === 'P2003') {
         return res.status(409).json({ message: 'Cannot delete category. It is currently associated with existing posts.' });
    }
    console.error("Error deleting category:", error);
    res.status(500).json({ message: 'Error deleting category.' });
  }
};

module.exports = {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
};