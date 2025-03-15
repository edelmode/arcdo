import { mainDB } from '../config/db.js';
import nodemailer from 'nodemailer';

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send email notification
const sendEmailNotification = async (email_address, company_name, remarks) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email_address,
        subject: 'Update on Your Industry Partners Record',
        text: `Dear ${company_name},

We would like to inform you that there has been an update to the remarks on your Industry Partners record. Please review the latest remarks as soon as possible:

Remarks: ${remarks}

Best regards,
ARCDO`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', email_address);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

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
        const {
            company_name,
            email_address,
            remarks = null,
            ...newPartner
        } = req.body;

        connection = await mainDB();
        const [result] = await connection.query(
            "INSERT INTO industry_partner SET ?",
            [{ company_name, email_address, remarks, ...newPartner }]
        );

        const addedPartner = {
            id: result.insertId,
            company_name,
            email_address,
            remarks,
            ...newPartner
        };

        // Send email notification if remarks is not empty or null
        if (remarks) {
            console.log('Sending email to', email_address);
            await sendEmailNotification(email_address, company_name, remarks);
        }

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
        const {
            company_name,
            email_address,
            remarks,
            ...updates
        } = req.body;

        connection = await mainDB();
        
        const updateQuery = 'UPDATE industry_partner SET ? WHERE id = ?';
        const [result] = await connection.query(updateQuery, [{ company_name, email_address, remarks, ...updates }, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        const [updated] = await connection.query('SELECT * FROM industry_partner WHERE id = ?', [id]);

        // Send email notification if remarks is not empty or null
        if (remarks) {
            console.log('Sending email to', email_address);
            await sendEmailNotification(email_address, company_name, remarks);
        }

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