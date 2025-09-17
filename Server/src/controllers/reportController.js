const db = require('../config/db');

exports.submitReport = async (req, res) => {
  const { incidentType, location, description } = req.body;
  const userId = req.user.id; // From authMiddleware

  // req.file is added by multer. It contains info about the uploaded file.
  const imageUrl = req.file ? req.file.path : null;

  try {
    const sql = 'INSERT INTO reports (user_id, incident_type, location, description, image_url) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [userId, incidentType, location, description, imageUrl]);

    res.status(201).json({ message: 'Report submitted successfully!' });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};