const { pool } = require('../database/mysqlDb');

class User {
  static async create({ 
    name, email, password, role, department_id,
    joiningDate, position, aadhar, panNo, address,
    dateOfBirth, githubId, linkedIn, phone, image 
  }) {
    const [result] = await pool.query(
      `INSERT INTO users (
        name, email, password, role, department_id,
        joiningDate, position, aadhar, panNo, address,
        dateOfBirth, githubId, linkedIn, phone, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, email, password, role || 'Employee', department_id || null,
        joiningDate || null, position || null, aadhar || null, panNo || null, address || null,
        dateOfBirth || null, githubId || null, linkedIn || null, phone || null, image || null
      ]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT users.*, departments.name as department_name 
       FROM users 
       LEFT JOIN departments ON users.department_id = departments.id 
       WHERE users.id = ?`, 
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT users.*, departments.name as department_name
       FROM users 
       LEFT JOIN departments ON users.department_id = departments.id`
    );
    return rows;
  }

  static async update(id, { 
    name, email, role, department_id,
    joiningDate, position, aadhar, panNo, address,
    dateOfBirth, githubId, linkedIn, phone, image 
  }) {
    const [result] = await pool.query(
      `UPDATE users SET 
        name = ?, email = ?, role = ?, department_id = ?,
        joiningDate = ?, position = ?, aadhar = ?, panNo = ?, address = ?,
        dateOfBirth = ?, githubId = ?, linkedIn = ?, phone = ?, image = ?
       WHERE id = ?`,
      [
        name, email, role, department_id || null,
        joiningDate || null, position || null, aadhar || null, panNo || null, address || null,
        dateOfBirth || null, githubId || null, linkedIn || null, phone || null, image || null,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
