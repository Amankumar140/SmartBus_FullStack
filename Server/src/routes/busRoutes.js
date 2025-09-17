const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllBuses } = require('../controllers/busController'); // We'll create this next

// Defines a GET request to the root of this route ('/api/buses/')
// It's protected by the authMiddleware.
router.get('/', authMiddleware, getAllBuses);

module.exports = router;