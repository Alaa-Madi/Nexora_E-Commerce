const sequelize = require('../config/db');
const User = require('../models/user');

const verifyAdmins = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Find all admin users
    const adminUsers = await User.findAll({ 
      where: { role: 'admin' },
      attributes: ['id', 'name', 'email', 'role']
    });

    console.log('Admin users found:', adminUsers.length);
    adminUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Find all users
    const allUsers = await User.findAll({ 
      attributes: ['id', 'name', 'email', 'role']
    });

    console.log('\nAll users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('Error verifying admins:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the verification function
verifyAdmins();
