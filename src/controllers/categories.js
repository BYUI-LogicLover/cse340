import { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Service Categories';

  res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    return next(error);
  }

  const projects = await getProjectsByCategoryId(categoryId);

  res.render('category', { title: category.name, category, projects });
};

const showNewCategoryForm = async (req, res) => {
    const title = 'Create New Category';

    res.render('new-category', { title });
}

const processNewCategoryForm = async (req, res) => {
    const { name, description } = req.body;

    const category = await createCategory(name, description);

    req.flash('success', 'Category created successfully!');

    res.redirect(`/category/${category.category_id}`);
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, project, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const categoryIds = req.body.categoryIds || [];

    await updateCategoryAssignments(projectId, categoryIds);

    req.flash('success', 'Categories updated successfully!');

    res.redirect(`/project/${projectId}`);
};

const showEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        return next(error);
    }

    res.render('edit-category', { title: 'Edit Category', category });
};

const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    const category = await getCategoryById(categoryId);

    if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        return next(error);
    }

    await updateCategory(categoryId, name, description);

    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`);
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage, showNewCategoryForm, processNewCategoryForm, showAssignCategoriesForm, processAssignCategoriesForm, showEditCategoryForm, processEditCategoryForm };
