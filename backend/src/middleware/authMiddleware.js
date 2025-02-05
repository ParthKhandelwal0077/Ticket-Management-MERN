const jwt = require('jsonwebtoken');
const { createCustomError } = require('../utils/errors');
const User = require('../models/User');
const logger = require('../config/winston');

// Protect routes - verify access token
const protect = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];
        
        if (!authHeader) {
            return next(createCustomError('No token provided, authorization denied', 401));
        }

        // Check if header follows Bearer scheme
        if (!authHeader.startsWith('Bearer ')) {
            return next(createCustomError('Invalid token format. Use Bearer scheme', 401));
        }

        // Get token from Bearer scheme (Bearer <token>)
        const token = authHeader.split(' ')[1];

        if (!token) {
            return next(createCustomError('No token provided, authorization denied', 401));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            
            // Get user from token
            const user = await User.findById(decoded.id).select('-password -refreshToken');
            
            if (!user) {
                return next(createCustomError('User not found', 401));
            }

            // Check if user is active
            if (!user.isActive) {
                return next(createCustomError('User account is deactivated', 401));
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(createCustomError('Token has expired', 401));
            }
            return next(createCustomError('Invalid token', 401));
        }
    } catch (error) {
        next(error);
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(createCustomError(
                `Role ${req.user.role} is not authorized to access this route`,
                403
            ));
        }
        next();
    };
};

module.exports = {
    protect,
    authorize
}; 