require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log('Starting server initialization...');
        
        // Middleware
        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(cookieParser()); // For handling JWT refresh tokens in cookies
        app.use(logger); // Add logger middleware before routes
        
        // API Routes
        app.use('/auth', authRoutes);  // Authentication routes
        app.use('/users', userRoutes); // User routes
        app.use('/articles', articleRoutes); // Article routes
        
        // Welcome route
        app.get('/', (req, res) => {
            res.json({ 
                message: 'Welcome to Ticket Management System API',
                version: '1.0',
                documentation: '/api/v1/docs' // If you add API documentation later
            });
        });
        
        // 404 handler
        app.use('*', (req, res) => {
            res.status(404).json({
                status: 'fail',
                message: `Can't find ${req.originalUrl} on this server`
            });
        });
        
        // Error handling middleware
        app.use(errorHandler);
        
        // Start server
        const PORT = process.env.PORT || 5500;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API is available at http://localhost:${PORT}/`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    }); 