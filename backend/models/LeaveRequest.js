const { pool } = require('../database/mysqlDb');

class LeaveRequest {
  static async create({ user_id, start_date, end_date, reason }) {
    const [result] = await pool.query(
    `INSERT INTO leave_requests (user_id, start_date, end_date, reason, status) 
       VALUES (?, ?, ?, ?, 'Pending')`,
      [user_id, start_date, end_date, reason]
    );
    return result.insertId;
  }

  static async findByUserId(user_id) {
    const [rows] = await pool.query(
      'SELECT * FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT leave_requests.*, users.name as user_name 
       FROM leave_requests 
       JOIN users ON leave_requests.user_id = users.id 
       ORDER BY created_at DESC`
    );
    return rows;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.query(
      'UPDATE leave_requests SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM leave_requests WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = LeaveRequest;
