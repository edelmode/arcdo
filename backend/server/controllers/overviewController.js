import initializeConnection from '../config/db.js';

export const getSummaryCards = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [summaryCards] = await connection.query(`
      SELECT 
        COALESCE((SELECT COUNT(*) FROM hte), 0) AS HTEs,
        COALESCE((SELECT COUNT(*) FROM moa), 0) AS MOAs,
        COALESCE((SELECT COUNT(*) FROM ojt_coordinator), 0) AS OJT_Coordinators,
        COALESCE((SELECT COUNT(*) FROM industry_partner), 0) AS Industry_Partners
    `);
    res.status(200).json(summaryCards[0]);
  } catch (error) {
    console.error('Error fetching summary cards data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) connection.end();
  }
};

export const getIndustrypartnercard = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [Industrypartnercard] = await connection.query(`
      SELECT moa_status AS STATUS, 
             COALESCE(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM industry_partner), 0) AS percentage, 
             CASE 
               WHEN moa_status = 'Completed' THEN '#34C759'
               WHEN moa_status = 'Processing' THEN '#6750A4'
               WHEN moa_status = 'On-hold' THEN '#FF2D55'
               ELSE '#CE93D8'
             END AS color
      FROM industry_partner
      GROUP BY moa_status
    `);
    res.status(200).json(Industrypartnercard);
  } catch (error) {
    console.error('Error fetching industry partner card data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) connection.end();
  }
};

export const getNatureOfBusinesses = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [natureOfBusinesses] = await connection.query(`
      SELECT business_type AS category, 
             COALESCE(COUNT(*), 0) AS count 
      FROM hte 
      GROUP BY business_type 
      ORDER BY count DESC
    `);
    res.status(200).json(natureOfBusinesses);
  } catch (error) {
    console.error('Error fetching nature of businesses data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) connection.end();
  }
};

export const getMoaStatus = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [moaStatus] = await connection.query(`
      SELECT moa_status AS STATUS, 
             COALESCE(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM moa), 0) AS percentage, 
             CASE 
               WHEN moa_status = 'Completed' THEN '#31111D'
               WHEN moa_status = 'For Renewal' THEN '#630F3C'
               WHEN moa_status = 'For Revision' THEN '#7A1642'
               ELSE '#FF2D55'  
             END AS color
      FROM moa
      GROUP BY moa_status
    `);
    res.status(200).json(moaStatus);
  } catch (error) {
    console.error('Error fetching MOA status data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) connection.end();
  }
};

export const getTableData = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [hteTableData] = await connection.query(`
      SELECT id AS DOC, 
             COALESCE(company_name, '') AS COMPANY, 
             COALESCE(office_address, '') AS ADDRESS, 
             COALESCE(year_submitted, '') AS DATE, 
             COALESCE(business_type, '') AS BUSINESS, 
             COALESCE(moa_status, '') AS STATUS 
      FROM hte
    `);

    const [industryPartnersTableData] = await connection.query(`
      SELECT id AS DOC, 
             COALESCE(company_name, '') AS COMPANY, 
             COALESCE(office_address, '') AS ADDRESS, 
             COALESCE(expiry_date, '') AS DATE, 
             COALESCE(business_type, '') AS BUSINESS, 
             COALESCE(moa_status, '') AS STATUS 
      FROM industry_partner
    `);

    const [ojtCoordinatorsTableData] = await connection.query(`
      SELECT id AS DOC, 
             COALESCE(name, '') AS COMPANY, 
             COALESCE(campus, '') AS ADDRESS, 
             COALESCE(assigned_student, '') AS DATE, 
             COALESCE(college, '') AS BUSINESS, 
             COALESCE(status, '') AS STATUS 
      FROM ojt_coordinator
    `);

    const tableData = {
      HTEs: hteTableData,
      "INDUSTRY PARTNERS": industryPartnersTableData,
      "OJT COORDINATORS": ojtCoordinatorsTableData,
    };

    res.status(200).json(tableData);
  } catch (error) {
    console.error('Error fetching table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) connection.end();
  }
};