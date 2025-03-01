import { mainDB } from '../config/db.js';
import bcrypt from 'bcrypt';

// Get all users
export const getUsers = async (req, res) => {
    let connection;
    try {
        connection = await mainDB();
        const sql = "SELECT * FROM users";
        const [results] = await connection.query(sql);
        res.json(results);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) await connection.end();
    }
};

// Create a new user
export const createUser = async (req, res) => {
    let connection;
    try {
        const { email, password, name, contact_number, position, campus, college } = req.body;
        
        // Input validation
        if (!email || !password || !name || !contact_number || !position || !campus || !college) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long and contain a number or special character.' });
        }

        connection = await mainDB();

        // Check if the email already exists
        const [existingUser] = await connection.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into users table
        const [userResult] = await connection.query(
            "INSERT INTO users (email, password, is_verified, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
            [email, hashedPassword, 0]
        );

        const userId = userResult.insertId;

        // Insert additional user info
        await connection.query(
            "INSERT INTO user_account (user_id, name, contact_number, position, campus, college) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, name, contact_number, position, campus, college]
        );
        
        res.status(201).json({ message: 'Registration successful. Please verify your account.', user_id: userId });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) await connection.end();
    }
};
