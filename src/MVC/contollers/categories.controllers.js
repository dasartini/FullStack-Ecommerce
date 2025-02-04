import { pool } from "../../db.js";

export const getCategories = async (req, res) => {
    try {
      const categories = await pool.query('SELECT * FROM Categories');
      res.json(categories.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const createCategory = async (req, res) => {
    const { category_name } = req.body;
    try {
      const newCategory = await pool.query(
        'INSERT INTO Categories (category_name) VALUES ($1) RETURNING *',
        [category_name]
      );
      res.status(201).json(newCategory.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };