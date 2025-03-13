require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const { connectDB, disconnectDB } = require('./config/db');
const logger = require('./utils/logger');
const Submission = require('./models/Submission');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple CORS middleware that allows all origins during development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Other middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: false // Disable for development
}));

// Serve static files
app.use(express.static('dist'));

// Test endpoint
app.post('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    console.log('Body:', req.body);
    res.json({ message: 'Test endpoint working' });
});

// API endpoint for waitlist submissions
app.post('/api/waitlist', [
  check('name').trim().notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('interest').isIn(['marketing', 'sdr', 'customer-service', 'sales', 'analytics'])
    .withMessage('Please select a valid interest area')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { name, email, company, interest } = req.body;

    // Connect to database if not already connected
    await connectDB();
    
    // Create new submission
    const submission = new Submission({
      name,
      email,
      company: company || '',
      interest
    });

    await submission.save();
    
    logger.info(`New waitlist submission: ${email}`);

    res.status(201).json({
      status: 'success',
      message: 'Your submission has been received!'
    });
  } catch (err) {
    logger.error('Waitlist submission error:', err);
    
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'This email has already been registered'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred'
    });
  }
});

// Connect and start server for local development
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });