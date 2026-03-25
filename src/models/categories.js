import db from './db.js'

const getAllCategories = async () => {
  const query = `
      SELECT category_id, name, description
      FROM public.category
      ORDER BY name;
  `;

  const result = await db.query(query);

  return result.rows;
}

const getCategoryById = async (categoryId) => {
  const query = `
      SELECT category_id, name, description
      FROM public.category
      WHERE category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows[0];
}

const getCategoriesByProjectId = async (projectId) => {
  const query = `
      SELECT c.category_id, c.name, c.description
      FROM public.category c
          JOIN public.project_category pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.name;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows;
}

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
      SELECT p.project_id, p.title, p.description, p.start_date, p.location,
             p.organization_id, o.name AS organization_name
      FROM public.project p
          JOIN public.project_category pc ON p.project_id = pc.project_id
          JOIN public.organization o ON p.organization_id = o.organization_id
      WHERE pc.category_id = $1
      ORDER BY p.start_date;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows;
}

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2)
    `;

    await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1
    `;

    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId, updateCategoryAssignments }
