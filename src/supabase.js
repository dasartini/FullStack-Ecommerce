import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImageSupa = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `${Date.now()}_${file.originalname}`;
    
    const { data, error } = await supabase.storage
      .from('your_bucket_name')
      .upload(`public/${fileName}`, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('your_bucket_name')
      .getPublicUrl(`public/${fileName}`);
      
    const result = await pool.query(
      'INSERT INTO images(url, name) VALUES($1, $2) RETURNING *',
      [publicUrl, fileName]
    );
    
    res.json({ 
      success: true, 
      image: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
