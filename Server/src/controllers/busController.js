const db = require('../config/db');

// Controller to get all buses from the database
exports.getAllBuses = async (req, res) => {
  try {
    // SQL query to select all records from the 'buses' table
    const sql = 'SELECT * FROM buses';

    // Execute the query
    const [buses] = await db.query(sql);

    // Send the list of buses back as a JSON response
    res.json(buses);

  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};