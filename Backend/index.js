const express = require('express');
const app = express();
const connectDB = require('./config/connection');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const diagnoseRoutes = require('./routes/diagnose.route');

require('dotenv').config();
app.use(cors());
app.use(express.json());
connectDB();

// Use user routes
app.use('/api/users', userRoutes);

// Use diagnose routes
app.use('/api/diagnose', diagnoseRoutes);




// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
