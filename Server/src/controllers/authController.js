const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// The 'signup' function that will be called by our route
exports.signup = async (req, res) => {
  // Get user data from the request body
  const { name, age, mobile_no, email, password, region_of_commute } = req.body;

  try {
    // --- Basic Validation ---
    if (!name || !mobile_no || !password) {
      return res.status(400).json({ message: 'Name, mobile number, and password are required' });
    }
    
    // Validate mobile number format (10 digits)
    if (!/^\d{10}$/.test(mobile_no)) {
      return res.status(400).json({ message: 'Mobile number must be 10 digits' });
    }

    // --- Password Hashing ---
    // First, check if a password was provided
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    // Create a "salt" for hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Database Insertion ---
    // Create the SQL query to insert a new user
    const sql = 'INSERT INTO users (name, age, mobile_no, email, password_hash, region_of_commute) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [name, age || null, mobile_no, email || null, hashedPassword, region_of_commute || null];

    // Execute the query
    await db.query(sql, values);

    // Send a success response back to the app
    res.status(201).json({ message: 'User created successfully!' });

  } catch (error) {
    console.error('Error signing up user:', error);
    // Handle potential errors, like a duplicate mobile number
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Mobile number or email already exists.' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


exports.login = async (req, res) => {
  const { mobile_no, password } = req.body;

  // Basic validation
  if (!mobile_no || !password) {
    return res.status(400).json({ message: 'Please provide mobile number and password.' });
  }

  try {
    // 1. Find the user in the database
    const [users] = await db.query('SELECT * FROM users WHERE mobile_no = ?', [mobile_no]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    
    // 3. If passwords match, create a JWT
    const payload = {
      user: {
        id: user.user_id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // Token will be valid for 7 days
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // 4. Send the token to the client
      }
    );

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};