const { pool } = require('../database/mysqlDb');

class Attendance {
  static async mark({ user_id, date, status }) {
    // Upsert if date already exists for user
    const [result] = await pool.query(
      \`INSERT INTO attendance (user_id, date, status) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = ?\`,
      [user_id, date, status, status]
    );
    return result.insertId || true;
  }

  static async findByUserId(user_id) {
    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC',
      [user_id]
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.query(
      \`SELECT attendance.*, users.name as user_name 
       FROM attendance 
       JOIN users ON attendance.user_id = users.id 
       ORDER BY date DESC\`
    );
    return rows;
  }

  static async getTrends() {
    // Returns counts of present/absent/leave for the chart
    const [rows] = await pool.query(
      \`SELECT status, COUNT(*) as count 
       FROM attendance 
       GROUP BY status\`
    );
    return rows;
  }
}

module.exports = Attendance;
