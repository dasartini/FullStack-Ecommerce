import { pool } from "../../db.js"

export const getUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT id, name, email, role FROM Users');
    res.json(users.rows);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

export const getUserByID = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await pool.query('SELECT id, name, email, role FROM Users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser =   async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const newUser = await pool.query(
      'INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, role || 'user']
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

