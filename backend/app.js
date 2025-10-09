require('dotenv').config(); // must be first line
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('./models');
const authRoutes = require('./routes/auth');
const catalogRoutes = require('./routes/catalog');
const checkoutRoutes = require('./routes/checkout');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', catalogRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Try to sync database, but start server even if it fails
sequelize.sync().then(() => {
  console.log('Database connected successfully');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.log('Database connection failed, starting server with limited functionality:', error.message);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (database not connected)`);
  });
});
