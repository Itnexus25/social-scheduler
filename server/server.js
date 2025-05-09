// ==================================================================
// Step 1: Import Required Modules
// ==================================================================
const express = require('express');       // Express framework for creating the server
const mongoose = require('mongoose');     // Mongoose for MongoDB object modeling and connection handling
const cors = require('cors');             // Middleware to enable cross-origin requests
const dotenv = require('dotenv');         // Dotenv to load environment variables from a .env file

// Import route handlers for authentication and post-related functionality
const authRoutes = require('./routes/authRoutes'); // Routes for user authentication (login, signup, etc.)
const postRoutes = require('./routes/postRoutes'); // Routes for post management (create, update, delete)

// Import middleware functions for route protection
const protect = require('./middleware/protect');     // Middleware to check user authentication
const adminOnly = require('./middleware/adminOnly'); // Middleware to restrict access to admin users

// ==================================================================
// Step 2: Configure Environment Variables
// ==================================================================
// Load environment variables from the .env file before accessing process.env
dotenv.config();

// ==================================================================
// Step 3: Initialize Express Application
// ==================================================================
// Create an instance of the Express application
const app = express();

// Define the server port, using environment variable if available, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// ==================================================================
// Step 4: Setup Middleware
// ==================================================================
// Enable CORS to allow API access from external sources (e.g., frontend applications)
app.use(cors());

// Middleware to parse incoming JSON data, making `req.body` accessible
app.use(express.json());

// ==================================================================
// Step 5: Define API Routes
// ==================================================================

// Basic Health Check Route:
// Returns a simple message to confirm that the API is running
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Authentication Routes:
// Mount authentication endpoints under `/api/auth` (e.g., login, register)
app.use('/api/auth', authRoutes);

// Post Routes:
// Mount post-related endpoints under `/api/posts`, ensuring authenticated users can access them
app.use('/api/posts', protect, postRoutes);

// Admin-Only Route:
// Restricts access to admin users only, using authentication and admin role verification
app.use('/api/admin', protect, adminOnly, (req, res) => {
  res.send('🛠 Admin endpoint accessed');
});

// ==================================================================
// Step 6: Connect to MongoDB and Start the Server
// ==================================================================

// Connect to MongoDB using the environment variable `MONGO_URI`
// Includes error handling to ensure a smooth connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    // Start the Express server once the database is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit the process if the database connection fails
  });

// ==================================================================
// Step 7: Export the Express App (Optional)
// ==================================================================
// Export the app instance for testing or modular integration in other files
module.exports = app;