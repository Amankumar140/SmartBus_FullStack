const db = require('../config/db');

exports.getAllBuses = async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ message: 'Source and destination are required.' });
  }

  try {
    // Convert search terms to lowercase and add wildcards
    const sourceSearch = `%${source.toLowerCase()}%`;
    const destinationSearch = `%${destination.toLowerCase()}%`;

    // --- Query for Direct "Available" Buses ---
    // Added LOWER() to make the search case-insensitive
    const availableQuery = `
      SELECT b.*, r.route_name, start_stop.stop_name as start_stop_name, end_stop.stop_name as end_stop_name FROM buses b
      JOIN routes r ON b.route_id = r.route_id
      JOIN busstops start_stop ON r.start_stop_id = start_stop.stop_id
      JOIN busstops end_stop ON r.end_stop_id = end_stop.stop_id
      WHERE LOWER(start_stop.stop_name) LIKE ? AND LOWER(end_stop.stop_name) LIKE ? AND b.status = 'active';
    `;
    const [availableBuses] = await db.query(availableQuery, [sourceSearch, destinationSearch]);

    // --- Query for "Alternate" Buses ---
    const alternateQuery = `
      SELECT b.*, r.route_name, start_stop.stop_name as start_stop_name, end_stop.stop_name as end_stop_name FROM buses b
      JOIN routes r ON b.route_id = r.route_id
      JOIN busstops start_stop ON r.start_stop_id = start_stop.stop_id
      JOIN busstops end_stop ON r.end_stop_id = end_stop.stop_id
      WHERE (LOWER(start_stop.stop_name) LIKE ? AND LOWER(end_stop.stop_name) NOT LIKE ?) 
      OR (LOWER(start_stop.stop_name) NOT LIKE ? AND LOWER(end_stop.stop_name) LIKE ?) 
      AND b.status = 'active';
    `;
    const [alternateBuses] = await db.query(alternateQuery, [sourceSearch, destinationSearch, sourceSearch, destinationSearch]);

    res.json({
      available: availableBuses,
      alternate: alternateBuses,
    });
    
  } catch (error) {
    console.error('Error fetching filtered buses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};