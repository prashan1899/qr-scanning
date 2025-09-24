const express = require('express');
const cors = require('cors');
require('dotenv').config();

const buildingRoutes = require('./routes/buildingRoutes');
const scanRoutes = require('./routes/scanRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/buildings', buildingRoutes);
app.use('/api/scan', scanRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});