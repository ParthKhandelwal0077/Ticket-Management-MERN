const logger = require('../config/winston');
const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
    // Log the error stack trace
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        ip: req.ip
    };

    // Check if it's a Mongoose error
    if (err instanceof mongoose.Error) {
        logger.error('Mongoose Error:', { ...errorDetails, type: 'mongoose' });
        
        // Handle different types of Mongoose errors
        if (err instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation Error',
                details: Object.values(err.errors).map(e => e.message)
            });
        }
        
        if (err instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID format'
            });
        }
    } else {
        // Log other errors
        logger.error('Application Error:', errorDetails);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Token expired'
        });
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong' 
            : err.message
    });
};

module.exports = errorHandler; 