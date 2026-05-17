const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ems',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise wrapper for pool
const promisePool = pool.promise();

// Create tables if they don't exist
const initializeDB = async () => {
  try {
    // We create the database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    }).promise();
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'ems'}\``);
    await connection.end();

    const createDepartmentsTable = `
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Employee') DEFAULT 'Employee',
        department_id INT,
        joiningDate DATE,
        position VARCHAR(100),
        aadhar VARCHAR(20),
        panNo VARCHAR(20),
        address TEXT,
        dateOfBirth DATE,
        githubId VARCHAR(100),
        linkedIn VARCHAR(100),
        phone VARCHAR(20),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
      )
    `;

    const createAttendanceTable = `
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent', 'Leave') DEFAULT 'Present',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_date (user_id, date)
      )
    `;

    const createLeaveRequestsTable = `
      CREATE TABLE IF NOT EXISTS leave_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    await promisePool.query(createDepartmentsTable);
    await promisePool.query(createUsersTable);
    await promisePool.query(createAttendanceTable);
    await promisePool.query(createLeaveRequestsTable);
    
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

module.exports = {
  pool: promisePool,
  initializeDB
};
