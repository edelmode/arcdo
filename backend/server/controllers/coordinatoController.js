import {mainDB} from '../config/db.js';

export const getCoordinators = async (req, res) => {
    let connection;
    try {
        const connection = await mainDB();
        const [coordinators] = await connection.query("SELECT * FROM ojt_coordinator");
        res.status(200).json(coordinators);
    } catch (error) {
        console.error("Error fetching coordinators:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

export const getCoordinatorById = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const connection = await mainDB();
        const [coordinator] = await connection.query("SELECT * FROM ojt_coordinator WHERE id = ?", [id]);
        
        if (coordinator.length === 0) {
            return res.status(404).json({ error: "Coordinator not found." });
        }

        res.status(200).json(coordinator[0]);
    } catch (error) {
        console.error("Error fetching coordinator by ID:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

export const addCoordinator = async (req, res) => {
    let connection;
    try {
        const { name, campus, college, assigned_student, status, email, office } = req.body;

        if (!name || !campus || !college || !assigned_student || !status || !email || !office) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const connection = await mainDB();
        const [result] = await connection.query(
            "INSERT INTO ojt_coordinator (name, campus, college, assigned_student, status, email, office, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [name, campus, college, assigned_student, status, email, office]
        );

        const newCoordinator = {
            id: result.insertId,
            name,
            campus,
            college,
            assigned_student,
            status,
            email,
            office
        };

        res.status(201).json(newCoordinator);
    } catch (error) {
        console.error("Error adding coordinator:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        if (connection) connection.end();
    }
};


export const updateCoordinator = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { name, campus, college, assigned_student, status, email, office } = req.body;

        if (!id || !name || !campus || !college || !assigned_student || !status || !email || !office) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const connection = await mainDB();
        const [result] = await connection.query(
            "UPDATE ojt_coordinator SET name = ?, campus = ?, college = ?, assigned_student = ?, status = ?, email = ?, office = ?, updated_at = NOW() WHERE id = ?",
            [name, campus, college, assigned_student, status, email, office, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Coordinator not found." });
        }

        res.status(200).json({ message: "Coordinator updated successfully." });
    } catch (error) {
        console.error("Error updating coordinator:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};

export const deleteCoordinator = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const connection = await mainDB();
        
        // Check if the coordinator exists
        const [existingCoordinator] = await connection.query("SELECT * FROM ojt_coordinator WHERE id = ?", [id]);
        if (existingCoordinator.length === 0) {
            return res.status(404).json({ error: "Coordinator not found." });
        }
        
        // Delete the coordinator
        const [result] = await connection.query("DELETE FROM ojt_coordinator WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Coordinator not found." });
        }
        
        res.status(200).json({ message: "Coordinator deleted successfully." });
    } catch (error) {
        console.error("Error deleting coordinator:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};