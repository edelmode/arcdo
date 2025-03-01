import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createConnection = async (config) => {
    try {
        return await mysql.createConnection(config);
    } catch (err) {
        throw err;
    }
};

// Default database connection
const mainDB = async () => {
    return createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        connectionLimit: 10,
    });
};

// MOA database connection
const moaDB = async () => {
    return createConnection({
        host: process.env.MOA_DB_HOST,
        user: process.env.MOA_DB_USER,
        password: process.env.MOA_DB_PASSWORD,
        database: process.env.MOA_DB_NAME,
        connectionLimit: 10,
    });
};

export { mainDB, moaDB };
