const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api', require('./routes/recommendationRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Server is running', 
    environment: process.env.NODE_ENV 
  });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot find ${req.originalUrl} on this server`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 