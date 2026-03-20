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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };