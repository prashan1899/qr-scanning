const express = require('express');
const cors = require('cors');
const buildingRoutes = require('./routes/buildingRoutes');
const scanRoutes = require('./routes/scanRoutes');

const app = express();

// Enable CORS for specific origins
app.use(cors());

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/buildings', buildingRoutes);
app.use('/api/scan', scanRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});