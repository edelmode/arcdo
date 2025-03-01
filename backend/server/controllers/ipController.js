import {mainDB} from '../config/db.js';

// Get all partners
export const getPartner = async (req, res) => {
    let connection;
    try {
        connection = await mainDB();
        const [partners] = await connection.query("SELECT * FROM industry_partner");

        res.status(200).json(partners);
    } catch (error) {
        console.error("Error fetching partners:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

// Get partner by ID
export const getPartnerById = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await mainDB();
        const [partner] = await connection.query("SELECT * FROM industry_partner WHERE id = ?", [id]);

        if (partner.length === 0) {
            return res.status(404).json({ error: "Partner not found." });
        }

        res.status(200).json(partner[0]);
    } catch (error) {
        console.error("Error fetching partner by ID:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

// Add a new partner
export const addPartner = async (req, res) => {
    let connection;
    try {
        const newPartner = { ...req.body };

        connection = await mainDB();
        const [result] = await connection.query(
            "INSERT INTO industry_partner SET ?",
            [newPartner]
        );

        const addedPartner = {
            id: result.insertId,
            ...newPartner
        };

        res.status(201).json(addedPartner);
    } catch (error) {
        console.error("Error adding partner:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        if (connection) connection.end();
    }
};

// Update an existing partner
export const updatePartner = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        connection = await mainDB();
        
        const updateQuery = 'UPDATE industry_partner SET ? WHERE id = ?';
        const [result] = await connection.query(updateQuery, [updates, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        const [updated] = await connection.query('SELECT * FROM industry_partner WHERE id = ?', [id]);
        res.json(updated[0]);

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) connection.end();
    }
};

// Delete a partner
export const deletePartner = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await mainDB();

        // Check if the partner record exists
        const [existingPartner] = await connection.query("SELECT * FROM industry_partner WHERE id = ?", [id]);
        if (existingPartner.length === 0) {
            return res.status(404).json({ error: "Partner not found." });
        }

        // Delete the partner record
        const [result] = await connection.query("DELETE FROM industry_partner WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Partner not found." });
        }

        res.status(200).json({ message: "Partner deleted successfully." });
    } catch (error) {
        console.error("Error deleting partner:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};