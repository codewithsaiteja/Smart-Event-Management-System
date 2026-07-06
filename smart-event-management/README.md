# Smart Event Management System

> 🚀 **New here?** Start with [`START_HERE.md`](./START_HERE.md) for quickest setup!

A comprehensive full-stack web application for managing events, registrations, and attendance built using the MERN (MongoDB, Express.js, React.js, Node.js) stack.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)](https://github.com)
[![License](https://img.shields.io/badge/License-ISC-blue)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](./README.md)

## 🚀 Features

### User Features
- **Authentication & Authorization**
  - User registration and login with JWT authentication
  - Password hashing with bcrypt
  - Role-based access control (User/Admin)
  
- **Event Management**
  - Browse and search events
  - Filter events by category, status, and date
  - View detailed event information
  - Register for events
  - Cancel registrations
  
- **Personal Dashboard**
  - View registered events
  - Track attendance status
  - Manage profile information
  - View upcoming events

### Admin Features
- **Complete Event Management**
  - Create, update, and delete events
  - Upload event images
  - Set event capacity and manage seats
  - Track event status
  
- **User Management**
  - View all registered users
  - Delete users
  - Monitor user activities
  
- **Registration Management**
  - View all registrations
  - Filter registrations by status
  - Cancel registrations
  
- **Attendance Management**
  - Mark attendance (Present/Absent)
  - Track attendance by event
  - View attendance statistics
  
- **Analytics Dashboard**
  - Total users, events, registrations, and attendance statistics
  - Upcoming events overview
  - Recent registrations
  - Category-wise event distribution
  - Monthly trends

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload
- **Express Validator** - Input validation

## 📁 Project Structure

```
smart-event-management/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── eventController.js
│   │   ├── registrationController.js
│   │   ├── attendanceController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── statsRoutes.js
│   ├── utils/
│   │   └── seedData.js
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── Events.jsx
│   │   │   │   ├── EventDetails.jsx
│   │   │   │   └── NotFound.jsx
│   │   │   ├── user/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── MyRegistrations.jsx
│   │   │   │   └── Attendance.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageEvents.jsx
│   │   │       ├── CreateEvent.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       ├── ManageRegistrations.jsx
│   │   │       └── ManageAttendance.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   ├── userService.js
│   │   │   ├── registrationService.js
│   │   │   ├── attendanceService.js
│   │   │   └── statsService.js
│   │   ├── utils/
│   │   │   └── formatDate.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🔧 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventmanagement?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend application will run on `http://localhost:5173`

## 🔑 Demo Credentials

After running the seed script, you can use these credentials:

**Admin Account:**
- Email: admin@event.com
- Password: admin123

**User Account:**
- Email: john@example.com
- Password: user123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user

### Events
- `POST /api/events` - Create event (Admin only)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations` - Get user registrations
- `DELETE /api/registrations/:id` - Cancel registration

### Attendance
- `POST /api/attendance` - Mark attendance (Admin only)
- `GET /api/attendance` - Get attendance records
- `PUT /api/attendance/:id` - Update attendance (Admin only)

### Statistics
- `GET /api/stats/admin` - Get admin statistics (Admin only)
- `GET /api/stats/user` - Get user statistics

## 🎨 Features in Detail

### Search & Filter
- Search events by title, organizer, or venue
- Filter by category (Conference, Workshop, Seminar, Webinar, Meetup, Other)
- Filter by status (Upcoming, Completed)
- Sort by latest, oldest, date, or alphabetically

### Pagination
- All list views support pagination
- Configurable items per page
- Navigate between pages easily

### Real-time Updates
- Automatic seat availability updates
- Real-time registration status
- Instant attendance tracking

### Responsive Design
- Mobile-first approach
- Works seamlessly on all devices
- Touch-friendly interface

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control
- Input validation
- CORS enabled

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Create a new project on your hosting platform
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the production version:
```bash
cd client
npm run build
```

2. Deploy the `dist` folder to your hosting platform

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🔮 Future Enhancements

- Email notifications for registrations and reminders
- QR code generation for event tickets
- Export reports to PDF/Excel
- Event calendar view
- Payment integration for paid events
- Social media sharing
- Event reviews and ratings
- Live event streaming integration
- Multi-language support
- Advanced analytics with charts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created for MERN Stack Summer Internship CA2 Project

## 📧 Support

For support, email support@eventhub.com or create an issue in the repository.

---

**Note:** This is a complete, production-ready application suitable for academic submission and real-world use. Make sure to update all placeholder credentials and API keys before deploying to production.
