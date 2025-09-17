const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getNotifications } = require('../controllers/notificationController');

// This route is protected. Only logged-in users can access it.
router.get('/', authMiddleware, getNotifications);

module.exports = router;