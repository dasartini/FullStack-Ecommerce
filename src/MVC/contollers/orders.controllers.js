import { pool } from "../../db.js";

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
              json_agg(
                json_build_object(
                  'product_id', Order_Items.product_id,
                  'product_name', Products.name,
                  'quantity', Order_Items.quantity,
                  'price', Order_Items.price
                )
              ) AS items
       FROM Orders
       JOIN Order_Items ON Orders.id = Order_Items.order_id
       JOIN Products ON Order_Items.product_id = Products.id
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
  const { items, total_price, customer_name, payment_status = "Pending", transaction_id } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert new order with additional columns
    const orderResult = await client.query(
      `INSERT INTO Orders (total_price, customer_name, payment_status, transaction_id) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [total_price, customer_name, payment_status, transaction_id]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      const { product_id, quantity, price } = item;

      // Insert into Order_Items
      await client.query(
        "INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, product_id, quantity, price]
      );

      // Update stock
      const stockUpdate = await client.query(
        "UPDATE Products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING stock",
        [quantity, product_id]
      );

      if (stockUpdate.rowCount === 0) {
        throw new Error(`Insufficient stock for product with ID ${product_id}`);
      }
    }

    // Commit transaction
    await client.query("COMMIT");

    res.status(200).json({ message: "Order placed successfully", orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  } finally {
    client.release();
  }
};

export const getCompletedOrders =  async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Orders WHERE payment_status = 'Completed'"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch completed orders" });
  }
} 


export const getSalesSummaryByProduct =  async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.name, SUM(oi.quantity) AS total_sold
       FROM Order_Items oi
       JOIN Products p ON oi.product_id = p.id
       GROUP BY p.name
       ORDER BY total_sold DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sales summary" });
  }
}

export const getRevenueByDate = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(created_at) AS sale_date, SUM(total_price) AS daily_revenue
       FROM Orders
       WHERE payment_status = 'Completed'
       GROUP BY sale_date
       ORDER BY sale_date DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily revenue" });
  }
}

export const getTopSellingProducts =  async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.name, SUM(oi.quantity) AS total_sold
       FROM Order_Items oi
       JOIN Products p ON oi.product_id = p.id
       GROUP BY p.name
       ORDER BY total_sold DESC
       LIMIT 10`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top-selling products" });
  }
}