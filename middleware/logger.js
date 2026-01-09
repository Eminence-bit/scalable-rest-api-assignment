const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Create log entry
const createLogEntry = (level, message, meta = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
};

// Write to log file
const writeToFile = (filename, logEntry) => {
  const logPath = path.join(logsDir, filename);
  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(logPath, logLine, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

// Logger middleware
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  const requestLog = createLogEntry(LOG_LEVELS.INFO, 'HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  });
  
  writeToFile('access.log', requestLog);
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const responseLog = createLogEntry(LOG_LEVELS.INFO, 'HTTP Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous'
    });
    
    writeToFile('access.log', responseLog);
  });
  
  next();
};

// Error logger
const errorLogger = (err, req, res, next) => {
  const errorLog = createLogEntry(LOG_LEVELS.ERROR, err.message, {
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.id || 'anonymous'
  });
  
  writeToFile('error.log', errorLog);
  next(err);
};

// Application logger
const appLogger = {
  info: (message, meta = {}) => {
    const logEntry = createLogEntry(LOG_LEVELS.INFO, message, meta);
    writeToFile('app.log', logEntry);
    console.log(`[INFO] ${message}`, meta);
  },
  
  warn: (message, meta = {}) => {
    const logEntry = createLogEntry(LOG_LEVELS.WARN, message, meta);
    writeToFile('app.log', logEntry);
    console.warn(`[WARN] ${message}`, meta);
  },
  
  error: (message, meta = {}) => {
    const logEntry = createLogEntry(LOG_LEVELS.ERROR, message, meta);
    writeToFile('error.log', logEntry);
    console.error(`[ERROR] ${message}`, meta);
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = createLogEntry(LOG_LEVELS.DEBUG, message, meta);
      writeToFile('debug.log', logEntry);
      console.log(`[DEBUG] ${message}`, meta);
    }
  }
};

module.exports = {
  logger,
  errorLogger,
  appLogger
};