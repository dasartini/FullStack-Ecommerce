import { pool } from "../../db.js";

export const getCustomerDetails = async (req, res) => {
    const { order_id } = req.params;
  console.log(order_id)
    try {
        console.log("here")
      const result = await pool.query(
        "SELECT * FROM CustomerDetails WHERE order_id = $1",
        [order_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer details not found for this order" });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log(error)
      console.error("Error retrieving customer details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const saveCustomerDetails = async (req, res) => {
  const { order_id } = req.params; 
  const {
    address_line_1,
    address_line_2,
    admin_area_2,
    admin_area_1,
    postal_code,
    email,
  } = req.body;

  if (!order_id || !address_line_1 || !postal_code || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const orderExists = await pool.query("SELECT id FROM Orders WHERE id = $1", [
      order_id,
    ]);

    if (orderExists.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const result = await pool.query(
      `INSERT INTO CustomerDetails 
       (order_id, address_line_1, address_line_2, admin_area_2, admin_area_1, postal_code, email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [order_id, address_line_1, address_line_2, admin_area_2, admin_area_1, postal_code, email]
    );

    res.status(201).json({ message: "Customer details saved", customerDetails: result.rows[0] });
  } catch (error) {
    console.error("Error saving customer details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
