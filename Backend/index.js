// Import and configure dotenv at the top
require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/connection');

// Middleware - Crucial for parsing JSON bodies
app.use(express.json());

// Connect to database
connectDB();

// Import routes
const userRoutes = require('./routes/user.routes');

// Use user routes
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
