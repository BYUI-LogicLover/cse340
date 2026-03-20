import db from './db.js'

const getAllProjects = async () => {
  try {
    const query = `
        SELECT p.project_id,
               o.name                    AS organization_name,
               p.description,
               p.location,
               p.start_date,
               STRING_AGG(c.name, ' | ') AS category_names
        FROM project p
                 JOIN organization o ON p.organization_id = o.organization_id
                 JOIN project_category pc ON p.project_id = pc.project_id
                 JOIN category c ON pc.category_id = c.category_id
        GROUP BY p.project_id, o.name, p.description, p.location, p.start_date;
    `;

    const result = await db.query(query);

    return result.rows;
  }
  catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export {getAllProjects}