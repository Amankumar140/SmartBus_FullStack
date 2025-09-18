const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { 
  getAllBuses, 
  searchBuses, 
  getAllBusStops, 
  getBusLocations,
  getBusDetails,
  getBusLocationById,
  getBusRoute,
  testBusData,
  seedTestData,
  exportAllData
} = require('../controllers/busController');

// Get all buses
router.get('/', authMiddleware, getAllBuses);

// Search buses by source and destination
router.get('/search', authMiddleware, searchBuses);

// Get all bus stops
router.get('/stops', authMiddleware, getAllBusStops);

// Get real-time bus locations
router.get('/locations', authMiddleware, getBusLocations);

// Get detailed bus information
router.get('/:busId/details', authMiddleware, getBusDetails);

// Get real-time location for specific bus
router.get('/:busId/location', authMiddleware, getBusLocationById);

// Get route stops for a bus
router.get('/:busId/route', authMiddleware, getBusRoute);

// Test endpoint to check database
router.get('/test/data', testBusData);

// Seed dummy data for testing
router.post('/seed/test', seedTestData);

// Export all database data
router.get('/export/all', exportAllData);

module.exports = router;
