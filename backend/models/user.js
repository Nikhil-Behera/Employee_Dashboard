const { pool } = require('../database/mysqlDb');

class User {
  static async create({ name, email, password, role, department_id }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role || 'Employee', department_id || null]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      \`SELECT users.*, departments.name as department_name 
       FROM users 
       LEFT JOIN departments ON users.department_id = departments.id 
       WHERE users.id = ?\`, 
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.query(
      \`SELECT users.id, users.name, users.email, users.role, users.created_at, departments.name as department_name
       FROM users 
       LEFT JOIN departments ON users.department_id = departments.id\`
    );
    return rows;
  }

  static async update(id, { name, email, role, department_id }) {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, department_id = ? WHERE id = ?',
      [name, email, role, department_id, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
