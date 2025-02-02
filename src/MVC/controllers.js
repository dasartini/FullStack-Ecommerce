import { pool } from "../db.js"

//Users:
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


//Products:
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
      const product = await pool.query('SELECT name, description, price, image_url FROM Products WHERE id = $1', [productId]);
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

//Orders:

  export const getOrders = async (req, res) => {
    res.send("obtainning orders")
    const { rows } = await pool.query("SELECT * FROM Orders")
    console.log(rows)
    return rows
}

export const getOrderByID =  async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await pool.query(
      `SELECT Orders.id, Orders.user_id, Orders.total_price, Orders.created_at, 
              json_agg(json_build_object('product_id', Order_Items.product_id, 
                                         'quantity', Order_Items.quantity, 
                                         'price', Order_Items.price)) AS items
       FROM Orders
       JOIN Order_Items ON Orders.id = Order_Items.order_id
       WHERE Orders.id = $1
       GROUP BY Orders.id`,
      [orderId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder =  async (req, res) => {
  const { user_id, items } = req.body;

  try {
    let totalPrice = 0;
    for (let item of items) {
      const product = await pool.query(
        'SELECT price FROM Products WHERE id = $1',
        [item.product_id]
      );
      totalPrice += product.rows[0].price * item.quantity;
    }

    const newOrder = await pool.query(
      `INSERT INTO Orders (user_id, total_price) 
       VALUES ($1, $2) RETURNING *`,
      [user_id, totalPrice]
    );

    const orderId = newOrder.rows[0].id;

    for (let item of items) {
      await pool.query(
        `INSERT INTO Order_Items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.status(201).json({ orderId, totalPrice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const makeCheckout = async (req, res) => {
  const { items, total_price } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      "INSERT INTO Orders (total_price) VALUES ($1) RETURNING id",
      [total_price]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      const { product_id, quantity, price } = item;

      await client.query(
        "INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, product_id, quantity, price]
      );

      const stockUpdate = await client.query(
        "UPDATE Products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING stock",
        [quantity, product_id]
      );

      if (stockUpdate.rowCount === 0) {
        throw new Error(
          `Insufficient stock for product with ID ${product_id}`
        );
      }
    }

    await client.query("COMMIT");

    res.status(200).json({ message: "Order placed successfully", orderId });
  } catch (err) {
    await client.query("ROLLBACK"); 
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  } finally {
    client.release();
  }
}

//Categories

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