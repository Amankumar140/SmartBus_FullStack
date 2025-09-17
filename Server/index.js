 
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
const reportRoutes = require('./src/routes/reportRoutes');

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
app.use('/uploads', express.static('uploads'));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// --- Socket.io Middleware for Authentication ---
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication Error: Token not provided'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication Error: Invalid token'));
    }
    socket.userId = decoded.user.id;
    next();
  });
});

// --- Socket.io Connection Logic ---
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected for real-time updates.`);
  socket.join(`user-${socket.userId}`); // For private notifications
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected.`);
  });
});

// --- REAL-TIME BUS TRACKING LOGIC ---
const trackBuses = async () => {
  try {
    const [buses] = await db.query(
      "SELECT bus_id, bus_number, current_location, status FROM buses WHERE status = 'active'"
    );
    io.emit('bus-location-update', buses); // Broadcasts to ALL users
  } catch (error) {
    console.error('Error fetching bus data for real-time update:', error);
  }
};

// --- REAL-TIME NOTIFICATION LOGIC ---
const sendNotifications = async () => {
  try {
    const [notifications] = await db.query('SELECT * FROM notifications ORDER BY sent_at DESC');
    const notificationsByUser = {};
    notifications.forEach(notif => {
      if (!notificationsByUser[notif.user_id]) {
        notificationsByUser[notif.user_id] = [];
      }
      notificationsByUser[notif.user_id].push(notif);
    });
    for (const userId in notificationsByUser) {
      io.to(`user-${userId}`).emit('new_notification', notificationsByUser[userId]); // Sends to specific users
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

// Start the server
server.listen(PORT, async () => {
  try {
    await db.query('SELECT 1');
    console.log('🎉 Database connected successfully!');

    // Start both real-time services
    setInterval(trackBuses, 20000);
    setInterval(sendNotifications, 20000);

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});