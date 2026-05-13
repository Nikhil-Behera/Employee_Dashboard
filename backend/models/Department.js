const { pool } = require('../database/mysqlDb');

class Department {
  static async create({ name, description }) {
    const [result] = await pool.query(
      'INSERT INTO departments (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM departments');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { name, description }) {
    const [result] = await pool.query(
      'UPDATE departments SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM departments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Department;
