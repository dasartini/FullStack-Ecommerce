import { pool } from "../../db.js"

export const getAllProducts = async (req, res) => {
    try {
      const products = await pool.query(
        `SELECT Products.*, Categories.category_name 
         FROM Products
         JOIN Categories ON Products.category_id = Categories.id`
      );
      res.json(products.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  export const getProductByID = async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await pool.query('SELECT id, name, description, price, stock, image_url, category_id FROM Products WHERE id = $1', [productId]);
      if (product.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  export const createProduct = async (req, res) => {
    const { name, description, price, stock, image_url, category_id } = req.body;
    try {
      const newProduct = await pool.query(
        `INSERT INTO Products (name, description, price, stock, image_url, category_id) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, description, price, stock, image_url, category_id]
      );
      res.status(201).json(newProduct.rows[0]);
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  };

 export const addProductStock = async (req, res) => {
    const { productId } = req.params;
    const { additionalStock } = req.body;
  
    if (additionalStock <= 0) {
      return res.status(400).json({ error: 'Additional stock must be greater than zero' });
    }
  
    try {
      const updatedProduct = await pool.query(
        'UPDATE Products SET stock = stock + $1 WHERE id = $2 RETURNING *',
        [additionalStock, productId]
      );
  
      if (updatedProduct.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(updatedProduct.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { newStock, newPrice } = req.body;

  try {
    if (newStock < 0 || newPrice < 0) {
      return res.status(400).json({ error: 'Stock and price must be non-negative values' });
    }

    const updatedProduct = await pool.query(
      `UPDATE Products 
       SET stock = COALESCE($1, stock), price = COALESCE($2, price) 
       WHERE id = $3 
       RETURNING *`,
      [newStock, newPrice, productId]
    );

    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
