const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDatabase = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

connectDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Event Management API is running',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
