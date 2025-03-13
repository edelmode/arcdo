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
        subject: 'Update on Your HTE Record',
        text: `Dear ${company_name},

We would like to inform you that there has been an update to the remarks on your HTE record. Please review the latest remarks as soon as possible:

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

export const getHte = async (req, res) => {
    let connection;
    try {
        connection = await mainDB();
        const [hte] = await connection.query("SELECT * FROM hte");
        res.status(200).json(hte);
    } catch (error) {
        console.error("Error fetching hte:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
}; 

export const getHteById = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await mainDB();
        const [hte] = await connection.query("SELECT * FROM hte WHERE id = ?", [id]);
        
        if (hte.length === 0) {
            return res.status(404).json({ error: "HTE not found." });
        }

        res.status(200).json(hte[0]);
    } catch (error) {
        console.error("Error fetching hte by ID:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

// Add a new HTE record
export const addHte = async (req, res) => {
    let connection;
    try {
        const {
            company_name,
            office_address,
            year_submitted,
            business_type,
            moa_status,
            contact_person,
            contact_number,
            email_address,
            remarks = null,
            campus = null,
            college = null,
            course = null,
            expiry_date = null,
            position_department,
            with_moa_date_notarized = null,
            year_included
        } = req.body;

        // Validate only the required fields
        if (
            !company_name ||
            !office_address ||
            !year_submitted ||
            !business_type ||
            !moa_status ||
            !contact_person ||
            !contact_number ||
            !email_address ||
            !position_department
        ) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        // Convert empty strings to null for date fields
        const formattedExpiryDate = expiry_date ? new Date(expiry_date).toISOString().split("T")[0] : null;
        const formattedMoaDate = with_moa_date_notarized ? new Date(with_moa_date_notarized).toISOString().split("T")[0] : null;

        connection = await mainDB();
        const [result] = await connection.query(
            `INSERT INTO hte (
                company_name, office_address, year_submitted, business_type, moa_status,
                contact_person, contact_number, email_address, remarks, campus, 
                college, course, expiry_date, position_department, with_moa_date_notarized, year_included, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());`,
            [
                company_name,
                office_address,
                year_submitted,
                business_type,
                moa_status,
                contact_person,
                contact_number,
                email_address,
                remarks,
                campus,
                college,
                course,
                formattedExpiryDate,
                position_department,
                formattedMoaDate,
                year_included
            ]
        );

        // Send email notification if remarks is not empty or null
        if (remarks) {
            console.log('Sending email to', email_address);
            await sendEmailNotification(email_address, company_name, remarks);
        }

        res.status(201).json({ id: result.insertId, message: "HTE added successfully." });
    } catch (error) {
        console.error("Error adding HTE:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

// Update an existing HTE record
export const updateHte = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const {
            company_name,
            office_address,
            year_submitted,
            business_type,
            moa_status,
            contact_person,
            contact_number,
            email_address,
            remarks,
            campus,
            college,
            course,
            expiry_date,
            position_department,
            with_moa_date_notarized,
            year_included,
        } = req.body;

        if (
            !company_name ||
            !office_address ||
            !year_submitted ||
            !business_type ||
            !moa_status ||
            !contact_person ||
            !contact_number ||
            !email_address ||
            !position_department
        ) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }        

        // Convert empty strings to null for date fields
        const formattedExpiryDate = expiry_date ? new Date(expiry_date).toISOString().split("T")[0] : null;
        const formattedMoaDate = with_moa_date_notarized ? new Date(with_moa_date_notarized).toISOString().split("T")[0] : null;

        connection = await mainDB();
        const [result] = await connection.query(
            `UPDATE hte SET 
                company_name = ?, office_address = ?, year_submitted = ?, business_type = ?, moa_status = ?,
                contact_person = ?, contact_number = ?, email_address = ?, remarks = ?, campus = ?, 
                college = ?, course = ?, expiry_date = ?, position_department = ?, with_moa_date_notarized = ?, year_included = ?, updated_at = NOW()
             WHERE id = ?`,
            [
                company_name,
                office_address,
                year_submitted,
                business_type,
                moa_status,
                contact_person,
                contact_number,
                email_address,
                remarks,
                campus,
                college,
                course,
                formattedExpiryDate,
                position_department,
                formattedMoaDate,
                year_included,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "HTE not found." });
        }

        // Send email notification if remarks is not empty or null
        if (remarks) {
            console.log('Sending email to', email_address);
            await sendEmailNotification(email_address, company_name, remarks);
        }

        res.status(200).json({ message: "HTE updated successfully." });
    } catch (error) {
        console.error("Error updating HTE:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

// Delete an HTE record
export const deleteHte = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await mainDB();
        
        // Check if the HTE record exists
        const [existingHte] = await connection.query("SELECT * FROM hte WHERE id = ?", [id]);
        if (existingHte.length === 0) {
            return res.status(404).json({ error: "HTE not found." });
        }
        
        // Delete the HTE record
        const [result] = await connection.query("DELETE FROM hte WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "HTE not found." });
        }
        
        res.status(200).json({ message: "HTE deleted successfully." });
    } catch (error) {
        console.error("Error deleting HTE:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};