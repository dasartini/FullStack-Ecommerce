import { pool } from "../../db.js"
import { upload } from "../../multer.js";

export const getAllProducts = async (req, res) => {

    try {
      const products = await pool.query(
        `SELECT Products.*, Categories.category_name 
         FROM Products
         JOIN Categories ON Products.category_id = Categories.id
         WHERE Products.is_deleted = false
         `
      );
      res.json(products.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  export const getProductByID = async (req, res) => {

  
    const productId = req.params.productid;
    try {
      const product = await pool.query(
        `SELECT id, name, description, price, stock, image_url, 
         category_id, isCoffee, details 
         FROM Products 
         WHERE id = $1`,
      // may be not needed AND is_deleted = false
        [productId]
      );
      if (product.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  export const createProduct = async (req, res) => {
    try {
      upload.single("image")(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
  
        const { name, price, stock, description, category_id, isCoffee, details } = req.body;
  
        if (!name || !price || !stock || !category_id) {
          return res.status(400).json({ error: "Missing required fields" });
        }
  
        const parsedDetails = details ? JSON.parse(details) : {};
  
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
         
  
        const result = await pool.query(
          `INSERT INTO products (name, price, stock, description, category_id, isCoffee, details, image_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [name, price, stock, description, category_id, isCoffee, parsedDetails, imageUrl]
        );
  
        res.status(201).json({ message: "Product created", product: result.rows[0] });
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

  export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock, image_url, category_id, isCoffee, details } = req.body;

    try {
      const checkProduct = await pool.query(
        'SELECT id FROM Products WHERE id = $1',
        [productId]
      );
      if (checkProduct.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

        if ((stock !== undefined && stock < 0) || (price !== undefined && price < 0)) {
            return res.status(400).json({ error: "Stock and price must be non-negative values" });
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
        if (isCoffee !== undefined) {  
            fields.push(`isCoffee = $${fields.length + 1}`);
            values.push(isCoffee);
        }
        if (details !== undefined) {  
            fields.push(`details = $${fields.length + 1}`);
            values.push(details);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }

        query += fields.join(", ") + ` WHERE id = $${fields.length + 1} RETURNING *`;
        values.push(productId);
        const updatedProduct = await pool.query(query, values);

        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(updatedProduct.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteProductByID = async (req, res) => {
  const productId = req.params.productid;

  try {
    // Soft delete the product
    await pool.query(
      'UPDATE Products SET is_deleted = true WHERE id = $1',
      [productId]
    );
    
    res.json({ message: 'Product marked as deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getStockLevels = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, stock FROM Products WHERE is_deleted = false ORDER BY stock ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product stock levels" });
  }
}


