const mysql = require('mysql2');
require('dotenv').config();

// Create a connection "pool". This is more efficient than single connections.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log('Database connection pool created.');

// Export the pool with promise support, which lets us use async/await
module.exports = pool.promise();