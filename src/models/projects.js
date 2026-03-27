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

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          start_date
        FROM project
        WHERE organization_id = $1
        ORDER BY start_date;
      `;

      const query_params = [organizationId];
      const result = await db.query(query, query_params);

      return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT p.project_id,
           p.title,
           p.description,
           p.start_date,
           p.location,
           p.organization_id,
           o.name AS organization_name
    FROM project p
         JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.start_date >= CURRENT_DATE
    ORDER BY p.start_date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};

const getProjectDetails = async (id) => {
  const query = `
    SELECT p.project_id,
           p.title,
           p.description,
           p.start_date,
           p.location,
           p.organization_id,
           o.name AS organization_name
    FROM project p
         JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, start_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id
    `;

    const query_params = [title, description, location, date, organizationId];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};

const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
      UPDATE project
      SET title = $1, description = $2, location = $3, start_date = $4, organization_id = $5
      WHERE project_id = $6
      RETURNING project_id
    `;

    const query_params = [title, description, location, date, organizationId, id];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject, updateProject };