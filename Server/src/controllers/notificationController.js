const db = require('../config/db');

// Controller to get notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    // The user ID is attached to req.user by our authMiddleware
    const userId = req.user.id;

    const sql = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC';

    const [notifications] = await db.query(sql, [userId]);

    res.json(notifications);

  } catch (error)
  {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};