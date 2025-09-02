require('dotenv').config(); // must be first line
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('./models');
const authRoutes = require('./routes/auth');
const catalogRoutes = require('./routes/catalog');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', catalogRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
