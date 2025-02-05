const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');

// Ensure logs directory exists
const logDirectory = path.join(__dirname, '../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating write stream
const accessLogStream = rfs.createStream('req.log', {
    interval: '1d', // rotate daily
    path: logDirectory,
    size: '10M', // rotate when size exceeds 10 MB
    compress: 'gzip' // compress rotated files
});

// Create a custom token for request body
morgan.token('body', (req) => {
    const body = { ...req.body };
    if (body.password) body.password = '***'; // Hide sensitive data
    return JSON.stringify(body);
});

// Create a custom format that includes the request body
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :body';

// Create console logger for development
const consoleFormat = ':method :url :status :response-time ms - :res[content-length]';
const consoleLogger = morgan(consoleFormat);

// Create file logger
const fileLogger = morgan(logFormat, { 
    stream: accessLogStream,
    skip: (req) => req.url === '/health' // Skip health check endpoints
});

// Combined middleware that logs to both console and file
const logger = (req, res, next) => {
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
        consoleLogger(req, res, (err) => {
            if (err) return next(err);
            // Always log to file regardless of environment
            fileLogger(req, res, next);
        });
    } else {
        // Only log to file in production
        fileLogger(req, res, next);
    }
};

module.exports = logger; 