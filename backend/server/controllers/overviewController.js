import { mainDB, moaDB } from '../config/db.js';

export const getSummaryCards = async (req, res) => {
  let mainConnection;
  let moaConnection;

  try {
    // CONNECT TO BOTH DATABASES 
    mainConnection = await mainDB();
    moaConnection = await moaDB();

    // EXECUTE QUERIES FROM moaDB FOR HTEs & MOAs
    const [moaSummary] = await moaConnection.query(`
      SELECT 
        (SELECT COUNT(*) FROM moa_documents) AS HTEs,
        (SELECT COUNT(*) FROM moa_documents) AS MOAs
    `);

    // EXECUTE QUERIES FROM mainDB FOR OJT_Coordinators & Industry_Partners
    const [mainSummary] = await mainConnection.query(`
      SELECT 
        (SELECT COUNT(*) FROM ojt_coordinator) AS OJT_Coordinators,
        (SELECT COUNT(*) FROM industry_partner) AS Industry_Partners
    `);

    // MERGE THE RESULTS INTO ONE OBJECT
    const summaryCards = {
      ...moaSummary[0], // HTEs & MOAs FROM moaDB
      ...mainSummary[0] // OJT_Coordinators & Industry_Partners FROM mainDB
    };

    res.status(200).json(summaryCards);
  } catch (error) {
    console.error('Error fetching summary cards data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // CLOSE CONNECTIONS TO PREVENT MEMORY LEAKS
    if (mainConnection) await mainConnection.end();
    if (moaConnection) await moaConnection.end();
  }
};


export const getIndustrypartnercard = async (req, res) => {
  let connection;
  try {
    connection = await mainDB();
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
    connection = await moaDB();
    const [natureOfBusinesses] = await connection.query(`
      SELECT nature_of_business AS category, COUNT(*) AS count 
      FROM moa_info 
      GROUP BY nature_of_business
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
    connection = await moaDB();
    const [moaStatus] = await connection.query(`
      SELECT status AS STATUS, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM moa_info) AS percentage, 
      CASE 
        WHEN status = 'Active' THEN '#FFDF00'
        WHEN status = 'Expiry' THEN '#DAA520'
        ELSE '#80000'
      END AS color
      FROM moa_info
      GROUP BY status
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
    connection = await mainDB();
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
