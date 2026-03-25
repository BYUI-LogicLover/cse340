import db from './db.js'

const getAllOrganizations = async () => {
  const query = `
      SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
  `;

  const result = await db.query(query);

  return result.rows;
}

const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM organization
      WHERE organization_id = $1;
    `;

      const query_params = [organizationId];
      const result = await db.query(query, query_params);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

const updateOrganization = async (id, name, description, contactEmail, logoFilename) => {
    const query = `
      UPDATE organization
      SET name = $1, description = $2, contact_email = $3, logo_filename = $4
      WHERE organization_id = $5
    `;

    const query_params = [name, description, contactEmail, logoFilename, id];
    await db.query(query, query_params);
};

// Export the model functions
export { getAllOrganizations, getOrganizationDetails, updateOrganization };