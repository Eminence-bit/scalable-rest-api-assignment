const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const { logger, errorLogger, appLogger } = require('./middleware/logger');

const app = express();

// Logging middleware (should be first)
app.use(logger);

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scalable REST API',
      version: '1.0.0',
      description: 'A scalable REST API with authentication and role-based access',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  appLogger.info('Health check requested');
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error logging middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  appLogger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  appLogger.warn('Route not found', { method: req.method, url: req.originalUrl });
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    appLogger.info('MongoDB connected successfully');
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    appLogger.error('MongoDB connection error', { error: err.message });
    console.error('MongoDB connection error:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  appLogger.info('Server started', { port: PORT });
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;