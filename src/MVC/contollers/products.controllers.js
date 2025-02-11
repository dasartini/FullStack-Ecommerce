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

  
    const productId = req.params.productid;
    try {
      const product = await pool.query('SELECT id, name, description, price, stock, image_url, category_id FROM Products WHERE id = $1', [productId]);
      if (product.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product.rows[0]);
    } catch (err) {
      console.log()
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

  export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock, image_url, category_id } = req.body;
  console.log("inside the func")
    try {
      if ((stock !== undefined && stock < 0) || (price !== undefined && price < 0)) {
        return res.status(400).json({ error: 'Stock and price must be non-negative values' });
      }
  
      const fields = [];
      const values = [];
      let query = `UPDATE Products SET `;
  
      if (name !== undefined) {
        fields.push(`name = $${fields.length + 1}`);
        values.push(name);
      }
      if (description !== undefined) {
        fields.push(`description = $${fields.length + 1}`);
        values.push(description);
      }
      if (price !== undefined) {
        fields.push(`price = $${fields.length + 1}`);
        values.push(price);
      }
      if (stock !== undefined) {
        fields.push(`stock = $${fields.length + 1}`);
        values.push(stock);
      }
      if (image_url !== undefined) {
        fields.push(`image_url = $${fields.length + 1}`);
        values.push(image_url);
      }
      if (category_id !== undefined) {
        fields.push(`category_id = $${fields.length + 1}`);
        values.push(category_id);
      }
  
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
      }
  
      query += fields.join(', ') + ` WHERE id = $${fields.length + 1} RETURNING *`;
      values.push(productId);
      const updatedProduct = await pool.query(query, values);
  
      if (updatedProduct.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(updatedProduct.rows[0]);
    } catch (err) {
      console.log("failre")
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  };
  

export const getStockLevels = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, stock FROM Products ORDER BY stock ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product stock levels" });
  }
}


