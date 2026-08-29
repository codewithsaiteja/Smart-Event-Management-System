const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectDatabase = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const ensureDemoUsers = require('./utils/ensureDemoUsers');

dotenv.config();

const app = express();

// ===============================
// Database
// ===============================
connectDatabase()
  .then(() => {
    return ensureDemoUsers();
  })
  .catch((error) => {
    console.error('Database initialization error:', error);
  });

// ===============================
// Middleware
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===============================
// CORS Configuration
// ===============================
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:4173',

  // Vercel production domains
  'https://smart-event-management-system-rho.vercel.app',
  'https://smart-event-management-system-c29qzrvh.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin
      // (Postman, mobile apps, server-to-server requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// ===============================
// Static Uploaded Files
// ===============================
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ===============================
// API Routes
// ===============================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// ===============================
// Health Check
// ===============================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Event Management API is running',
  });
});

// ===============================
// Error Handler
// ===============================
app.use(errorHandler);

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});