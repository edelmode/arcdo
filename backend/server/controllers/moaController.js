import {moaDB} from '../config/db.js';

// Get all MOA records
export const getMoa = async (req, res) => {
    let connection;
    try {
        const connection = await moaDB();
        const [moa] = await connection.query("SELECT * FROM moa_info");
        res.status(200).json(moa);
    } catch (error) {
        console.error("Error fetching moa:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

// Get MOA by ID
export const getMoaById = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const connection = await moaDB();
        const [moa] = await connection.query("SELECT * FROM moa WHERE id = ?", [id]);
        
        if (moa.length === 0) {
            return res.status(404).json({ error: "MOA not found." });
        }

        res.status(200).json(moa[0]);
    } catch (error) {
        console.error("Error fetching moa by ID:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }  finally {
        if (connection) connection.end();
    }
};

// Add a new MOA record
export const addMoa = async (req, res) => {
    let connection;
    try {
        const {
            company_name,
            address,
            year_moa_started,
            business_type,
            moa_status,
            contact_person,
            contact_no,
            email,
            remarks,
            expiration_date,
            type_of_moa,
            validity,
            date_notarized
        } = req.body;
        
        // Validate all required fields
        if (
            !company_name ||
            !address ||
            !business_type ||
            !moa_status ||
            !contact_person ||
            !contact_no ||
            !email ||
            !type_of_moa
        ) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        // Convert empty date strings to null
        const yearMoaStarted = year_moa_started ? year_moa_started : null;
        const expirationDate = expiration_date ? expiration_date : null;
        const dateNotarized = date_notarized ? date_notarized : null;

        connection = await moaDB();
        const [result] = await connection.query(
            `INSERT INTO moa (
                company_name, address, year_moa_started, business_type, moa_status,
                contact_person, contact_no, email, remarks, expiration_date,
                type_of_moa, validity, date_notarized
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                company_name,
                address,
                yearMoaStarted,
                business_type,
                moa_status,
                contact_person,
                contact_no,
                email,
                remarks,
                expirationDate,
                type_of_moa,
                validity,
                dateNotarized
            ]
        );

        res.status(201).json({ id: result.insertId, message: "MOA added successfully." });
    } catch (error) {
        console.error("Error adding MOA:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};


// Update an existing MOA record
export const updateMoa = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "MOA ID is required." });
        }

        let {
            company_name,
            address,
            year_moa_started,
            business_type,
            moa_status,
            contact_person,
            contact_no,
            email,
            remarks,
            expiration_date,
            type_of_moa,
            validity,
            date_notarized
        } = req.body;

        // Convert empty strings to null for date fields
        const formattedMoaDate = year_moa_started ? new Date(year_moa_started).toISOString().split("T")[0] : null;
        const formattedExpiryDate = expiration_date ? new Date(expiration_date).toISOString().split("T")[0] : null;
        const formattedNotarizedDate = date_notarized ? new Date(date_notarized).toISOString().split("T")[0] : null;

        connection = await moaDB();
        const [result] = await connection.query(
            `UPDATE moa SET 
                company_name = ?, 
                address = ?, 
                year_moa_started = ?, 
                business_type = ?, 
                moa_status = ?,
                contact_person = ?, 
                contact_no = ?, 
                email = ?, 
                remarks = ?, 
                expiration_date = ?, 
                type_of_moa = ?, 
                validity = ?, 
                date_notarized = ?
             WHERE id = ?`,
            [
                company_name,
                address,
                formattedMoaDate,
                business_type,
                moa_status,
                contact_person,
                contact_no,
                email,
                remarks,
                formattedExpiryDate,
                type_of_moa,
                validity,
                formattedNotarizedDate,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "MOA not found." });
        }

        res.status(200).json({ message: "MOA updated successfully." });
    } catch (error) {
        console.error("Error updating MOA:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};


// Delete an MOA record
export const deleteMoa = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const connection = await moaDB();
        
        // Check if the MOA record exists
        const [existingMoa] = await connection.query("SELECT * FROM moa WHERE id = ?", [id]);
        if (existingMoa.length === 0) {
            return res.status(404).json({ error: "MOA not found." });
        }
        
        // Delete the MOA record
        const [result] = await connection.query("DELETE FROM moa WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "MOA not found." });
        }
        
        res.status(200).json({ message: "MOA deleted successfully." });
    } catch (error) {
        console.error("Error deleting MOA:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};
