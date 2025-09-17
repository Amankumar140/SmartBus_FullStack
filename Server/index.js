require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const busRoutes = require('./src/routes/busRoutes');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// --- THIS LINE WAS MISSING ---
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('<h1>SmartBus Backend is Running!</h1>');
});

// all apis
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/buses', busRoutes);

// Basic Socket.io connection listener
io.on('connection', (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server and test the database connection
server.listen(PORT, async () => {
  try {
    await db.query('SELECT 1');
    console.log('🎉 Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});