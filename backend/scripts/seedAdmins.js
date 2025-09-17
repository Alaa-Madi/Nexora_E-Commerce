const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const User = require('../models/user');

const seedAdmins = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if admin users already exist
    const existingAdmin1 = await User.findOne({ where: { email: 'admin1@example.com' } });
    const existingAdmin2 = await User.findOne({ where: { email: 'admin2@example.com' } });

    if (existingAdmin1) {
      console.log('Admin 1 already exists');
    } else {
      // Create first admin user
      const hashedPassword1 = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin One',
        email: 'admin1@example.com',
        password: hashedPassword1,
        role: 'admin'
      });
      console.log('Admin 1 created successfully');
    }

    if (existingAdmin2) {
      console.log('Admin 2 already exists');
    } else {
      // Create second admin user
      const hashedPassword2 = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin Two',
        email: 'admin2@example.com',
        password: hashedPassword2,
        role: 'admin'
      });
      console.log('Admin 2 created successfully');
    }

    console.log('Admin seeding completed!');
    console.log('Admin credentials:');
    console.log('Admin 1: admin1@example.com / admin123');
    console.log('Admin 2: admin2@example.com / admin123');

  } catch (error) {
    console.error('Error seeding admins:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the seeding function
seedAdmins();
