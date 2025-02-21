import { pool } from '../../db.js';

export const uploadImage = async (req, res) => {
  const { id } = req.params;
  console.log("QWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWww",id)
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  try {
    const result = await pool.query(
      'UPDATE your_table SET image_url = $1 WHERE id = $2 RETURNING *',
      [imageUrl, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ success: true, updatedRecord: result.rows[0] });
  } catch (error) {
    console.log(error)
    console.error('Error updating image URL:', error);
    res.status(500).json({ error: 'Database update failed' });
  }
};

