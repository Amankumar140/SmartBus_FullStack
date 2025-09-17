require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./src/config/db');

// Import all route handlers
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const busRoutes = require('./src/routes/busRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/notifications', notificationRoutes);

// --- NEW: Socket.io Middleware for Authentication ---
// This runs for every new socket connection to verify their JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication Error: Token not provided'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication Error: Invalid token'));
    }
    // Attach user id to the socket object
    socket.userId = decoded.user.id;
    next();
  });
});

// --- UPDATED: Socket.io Connection Logic ---
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected with socket ID: ${socket.id}`);

  // Join a private room based on the user's ID
  // This allows us to send notifications only to this specific user
  socket.join(`user-${socket.userId}`);

  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected: ${socket.id}`);
  });
});

// --- NEW: Function to check for and send notifications ---
const sendNotifications = async () => {
  try {
    const [notifications] = await db.query('SELECT * FROM notifications ORDER BY sent_at DESC');
    
    // Group notifications by user to send them efficiently
    const notificationsByUser = {};
    notifications.forEach(notif => {
      if (!notificationsByUser[notif.user_id]) {
        notificationsByUser[notif.user_id] = [];
      }
      notificationsByUser[notif.user_id].push(notif);
    });

    // Loop through each user who has notifications and send them
    for (const userId in notificationsByUser) {
      io.to(`user-${userId}`).emit('new_notification', notificationsByUser[userId]);
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

// Start the server and test the database connection
server.listen(PORT, async () => {
  try {
    await db.query('SELECT 1');
    console.log('🎉 Database connected successfully!');

    // --- NEW: Start the real-time notification service ---
    // Runs every 20 seconds to push updates
    setInterval(sendNotifications, 20000);

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});