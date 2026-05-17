const { pool, initializeDB } = require('./database/mysqlDb');
const bcrypt = require('bcryptjs');

const setupAdmin = async () => {
  try {
    console.log("Initializing database...");
    await initializeDB();

    const email = 'admin@test.com';
    const password = 'admin123';
    
    // Check if user already exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', email, hashedPassword, 'Admin']
    );

    console.log("------------------------------------------");
    console.log("✅ Admin account created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("------------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

setupAdmin();
