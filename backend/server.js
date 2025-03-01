import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { mainDB, moaDB } from './server/config/db.js';

// Import your routes
import authRoutes from './server/routes/auth.js';
import userRoutes from './server/routes/user.js';
import coordinatorRoutes from './server/routes/coordinator.js';
import moaRoutes from './server/routes/moa.js';
import hteRoutes from './server/routes/hte.js';
import ipRoutes from './server/routes/ip.js';
import adminRoutes from './server/routes/admin.js';
import overviewRoutes from './server/routes/overview.js';

dotenv.config();

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Initialization and Server Start
const startServer = async () => {
  let mainDBConnection;
  let moaDBConnection;

  try {
    // Initialize Main Database
    mainDBConnection = await mainDB();

    // Middleware to attach the main DB connection to requests (except /api/moa)
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api/moa')) {
        req.db = mainDBConnection;
      }
      next();
    });

    // Initialize MOA Database Connection only for MOA routes
    moaDBConnection = await moaDB();

    app.use('/api/moa', (req, res, next) => {
      req.db = moaDBConnection;
      next();
    }, moaRoutes);

    // Define API Routes (using mainDB)
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/coordinator', coordinatorRoutes);
    app.use('/api/hte', hteRoutes);
    app.use('/api/ip', ipRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/overview', overviewRoutes);

    // Start Server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  } finally {
    if (mainDBConnection) mainDBConnection.end();
    if (moaDBConnection) moaDBConnection.end();
  }
};

startServer();
