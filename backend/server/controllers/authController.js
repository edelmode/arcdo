import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {mainDB} from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
const clientUrl = process.env.CLIENT_URL;

function validatePassword(password) {
    return password.length >= 8 && /[0-9!@#$%^&*]/.test(password);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export const register = async (req, res) => {
    let connection;
    try {
        const { email, password, name, contact_number, position, campus, college, role = 'User'} = req.body;
        
        if (!email || !password || !name || !contact_number || !position || !campus || !college) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long and contain a number or special character.' });
        }

        const connection = await mainDB();

        const [existingUser] = await connection.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [userResult] = await connection.query(
            "INSERT INTO users (email, password, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
            [email, hashedPassword, 0]
        );

        const userId = userResult.insertId;

        await connection.query(
            "INSERT INTO user_account (user_id, name, contact_number, position, campus, college) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, name, contact_number, position, campus, college]
        );

        // Notify Super Admins about the new registration
        const adminSql = "SELECT email FROM users WHERE role = 'Super Admin'";
        const [adminResults] = await connection.query(adminSql);
        
        if (adminResults.length > 0) {
            const adminEmails = adminResults.map(admin => admin.email);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: adminEmails.join(','),
                subject: 'New User Registration',
                text: `A new user has registered IN ARCDO Dashboard with email: ${email}.
                       Add them as an admin` 
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }
        
        res.status(201).json({ message: 'Registration successful. Please verify your account.', user_id: userId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: `An error occurred during registration: ${error.message}` });
    }  finally {
        if (connection) connection.end();
    }
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'profile-pictures');
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      // Create unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, 'profile-' + uniqueSuffix + ext);
    }
  });
  
  // File filter to only allow image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter: fileFilter
});
  
export const userDetails = async (req, res) => {
    const user_id = req.params.id;
  
    if (!user_id) {
        return res.status(400).json({ error: "User ID is required." });
    }
  
    let connection;
    try {
        connection = await mainDB();
          
        const [userInfo] = await connection.query(
            "SELECT name, contact_number, position, campus, profilePicture, college FROM user_account WHERE user_id = ?",
            [user_id]
        );

        if (userInfo.length === 0) {
            return res.status(404).json({ error: "User details not found." });
        }

        const userDetails = userInfo[0];
        
        // Just return the filename in the response
        if (userDetails.profilePicture) {
            userDetails.profilePicture = `/uploads/profile-pictures/${path.basename(userDetails.profilePicture)}`;
        }

        res.json(userDetails);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    } finally {
        if (connection) connection.end();
    }
};
  

export const updateUserDetailsWithProfilePicture = [
    upload.single('profilePicture'),
    async (req, res) => {
        const user_id = req.params.id;
        const { name, contact_number, position, campus, college, profilePicture } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        // Check if required fields are present
        if (!name || !contact_number || !position || !campus || !college) {
            return res.status(400).json({ error: "All fields are required to update." });
        }

        let connection;
        try {
            connection = await mainDB();
            
            // In updateUserDetailsWithProfilePicture controller
            let profilePicturePath;

            if (req.file) {
            // If a new file was uploaded, use its filename
            profilePicturePath = req.file.filename;
            } else {
            // If no new file, get current profile picture from DB
            const [currentUser] = await connection.query(
                "SELECT profilePicture FROM user_account WHERE user_id = ?",
                [user_id]
            );
            profilePicturePath = currentUser[0]?.profilePicture || null;
            }

            // Update SQL query to include profile picture
            const [updateResult] = await connection.query(
            "UPDATE user_account SET name = ?, contact_number = ?, position = ?, campus = ?, college = ?, profilePicture = ? WHERE user_id = ?", 
            [name, contact_number, position, campus, college, profilePicturePath, user_id]
            );

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ error: "User details not found for this user ID." });
            }

            // Retrieve the updated user details
            const [updatedUserInfo] = await connection.query(
                "SELECT name, contact_number, position, campus, college, profilePicture FROM user_account WHERE user_id = ?",
                [user_id]
            );
            
            // Format the profile picture URL in the response
            const userInfo = updatedUserInfo[0];
            const formattedProfilePicture = userInfo.profilePicture 
                ? `http://localhost:3001/uploads/profile-pictures/${userInfo.profilePicture}`
                : null;

            res.json({
                message: "User details updated successfully.",
                updatedUserInfo: {
                    ...userInfo,
                    profilePicture: formattedProfilePicture
                }
            });
        } catch (error) {
            console.error("Error updating user details:", error);
            res.status(500).json({ error: `An error occurred: ${error.message}` });
        } finally {
            if (connection) connection.end();
        }
    }
];


// export const updateUserDetails = async (req, res) => {
//     const user_id = req.params.id;  // Retrieve user ID from the URL
//     const { name, contact_number, position, campus, college } = req.body;  // New data to update

//     if (!user_id) {
//         return res.status(400).json({ error: "User ID is required." });
//     }

//     if (!name || !contact_number || !position || !campus || !college) {
//         return res.status(400).json({ error: "All fields are required to update." });
//     }

//     let connection;
//     try {
//         connection = await mainDB();

//         // Update user details in the database
//         const [updateResult] = await connection.query(
//             "UPDATE user_account SET name = ?, contact_number = ?, position = ?, campus = ?, college = ?, profilePicture = ? WHERE user_id = ?", 
//             [name, contact_number, position, campus, college, user_id, profilePicture]
//         );

//         if (updateResult.affectedRows === 0) {
//             return res.status(404).json({ error: "User details not found for this user ID." });
//         }

//         // Retrieve the updated user details
//         const [updatedUserInfo] = await connection.query(
//             "SELECT name, contact_number, position, campus, college, profilePicture FROM user_account WHERE user_id = ?",
//             [user_id]
//         );

//         res.json({
//             message: "User details updated successfully.",
//             updatedUserInfo: updatedUserInfo[0]
//         });
//     } catch (error) {
//         console.error("Error updating user details:", error);
//         res.status(500).json({ error: `An error occurred: ${error.message}` });
//     } finally {
//         if (connection) connection.end();
//     }
// };

export const login = async (req, res) => {
    let connection;
    try {
        const { email, password } = req.body;
        const connection = await mainDB();
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [results] = await connection.query(sql, [email]);

        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '24h' });
        const refresh_token = jwt.sign({ id: user.id, email: user.email }, refreshSecretKey);

        const updateSql = 'UPDATE users SET refresh_token = ?, last_login = NOW() WHERE id = ?';
        await connection.query(updateSql, [refresh_token, user.id]);

        // Notify Super Admins about the login event
        const adminSql = "SELECT email FROM users WHERE role = 'Super Admin'";
        const [adminResults] = await connection.query(adminSql);
        
        if (adminResults.length > 0) {
            const adminEmails = adminResults.map(admin => admin.email);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: adminEmails.join(','),
                subject: 'Security Alert: User Logged In',
                text: `User with email ${user.email} has logged into the ARCDO Dashboard.`
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }

        res.json({ token, refresh_token, id: user.id, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error logging in' });
    } finally {
        if (connection) connection.end();
    }
};



export const refresh_token = async (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
        return res.status(401).send('Refresh token is required');
    }
    let connection;
    try {
        const decoded = jwt.verify(refresh_token, refreshSecretKey);
        const connection = await mainDB();
        const sql = 'SELECT * FROM users WHERE id = ? AND refresh_token = ?';
        const [results] = await connection.query(sql, [decoded.id, refresh_token]);

        if (results.length === 0) {
            return res.status(403).send('Invalid refresh token');
        }

        const user = results[0];
        const newToken = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '24h' });

        res.json({ token: newToken });
    } catch (error) {
        res.status(403).send('Invalid refresh token');
    } finally {
        if (connection) connection.end();
    }
};

export const verify_token = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let connection;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Token is valid", user: decoded });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    } finally {
        if (connection) connection.end();
    }
};

export const protectedRoute = (req, res) => {
    const { email } = req.user;
    res.send(`Welcome ${email}! This is a protected route.`);
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    let connection;
    try {
        const connection = await mainDB();

        // Check if the user exists in the database
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [results] = await connection.query(sql, [email]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        const user = results[0];

        // Create a reset token
        const resetToken = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

        // Construct the reset URL
        const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        // Attempt to send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending reset link. Please try again later.' });
    } finally {
        if (connection) connection.end();
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    let connection;
    try {
        const decoded = jwt.verify(token, secretKey);
        const { email } = decoded;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const connection = await mainDB();
        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        await connection.query(sql, [hashedPassword, email]);

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    } finally {
        if (connection) connection.end();
    }
};