import initializeConnection from '../config/db.js';

export const getSummaryCards = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [summaryCards] = await connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM hte) AS HTEs,
        (SELECT COUNT(*) FROM moa) AS MOAs,
        (SELECT COUNT(*) FROM ojt_coordinator) AS OJT_Coordinators,
        (SELECT COUNT(*) FROM industry_partner) AS Industry_Partners
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
    const [industryPartnerCard] = await connection.query(`
      SELECT moa_status AS STATUS, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM industry_partner) AS percentage, 
      CASE 
        WHEN moa_status = 'Completed' THEN '#34C759'
        WHEN moa_status = 'Processing' THEN '#6750A4'
        WHEN moa_status = 'On hold' THEN '#FF2D55'
        ELSE '#CE93D8'
      END AS color
      FROM industry_partner
      GROUP BY moa_status
    `);
    res.status(200).json(industryPartnerCard);
  } catch (error) {
    console.error('Error fetching industry partner card data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) await connection.end();
  }
};

export const getNatureOfBusinesses = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [natureOfBusinesses] = await connection.query(`
      SELECT business_type AS category, COUNT(*) AS count 
      FROM hte 
      GROUP BY business_type 
      ORDER BY count DESC
      LIMIT 5
    `);
    res.status(200).json(natureOfBusinesses);
  } catch (error) {
    console.error('Error fetching nature of businesses data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) await connection.end();
  }
};

export const getMoaStatus = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [moaStatus] = await connection.query(`
      SELECT moa_status AS STATUS, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM moa) AS percentage, 
      CASE 
        WHEN moa_status = 'Completed' THEN '#FFDF00'
        WHEN moa_status = 'For Renewal' THEN '#DAA520'
        WHEN moa_status = 'For Revision' THEN '#80000'
        ELSE '#FFFFFF'  
      END AS color
      FROM moa
      GROUP BY moa_status
    `);
    res.status(200).json(moaStatus);
  } catch (error) {
    console.error('Error fetching MOA status data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) await connection.end();
  }
};

export const getTableData = async (req, res) => {
  let connection;
  try {
    connection = await initializeConnection();
    const [hteTableData] = await connection.query(`
      SELECT id AS DOC, company_name AS COMPANY, office_address AS ADDRESS, year_submitted AS DATE, business_type AS BUSINESS, moa_status AS STATUS FROM hte WHERE moa_status = 'On hold' or moa_status = 'Rejected'
    `);

    const [industryPartnersTableData] = await connection.query(`
      SELECT id AS DOC, company_name AS COMPANY, office_address AS ADDRESS, expiry_date AS DATE, business_type AS BUSINESS, moa_status AS STATUS FROM industry_partner WHERE moa_status = 'On hold' or moa_status = 'Rejected'
    `);

    const [ojtCoordinatorsTableData] = await connection.query(`
      SELECT id AS DOC, name AS COMPANY, campus AS ADDRESS, assigned_student AS DATE, college AS BUSINESS, status AS STATUS FROM ojt_coordinator WHERE status = 'On-leave' or status = 'Retired'
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
