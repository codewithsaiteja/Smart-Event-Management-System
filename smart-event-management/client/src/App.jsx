import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Events from './pages/public/Events';
import EventDetails from './pages/public/EventDetails';
import NotFound from './pages/public/NotFound';

import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import MyRegistrations from './pages/user/MyRegistrations';
import Attendance from './pages/user/Attendance';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import CreateEvent from './pages/admin/CreateEvent';
import ManageUsers from './pages/admin/ManageUsers';
import ManageRegistrations from './pages/admin/ManageRegistrations';
import ManageAttendance from './pages/admin/ManageAttendance';
import EditEvent from './pages/admin/EditEvent';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/events"
            element={
              <ProtectedRoute adminOnly>
                <ManageEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/events/create"
            element={
              <ProtectedRoute adminOnly>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/events/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute adminOnly>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/registrations"
            element={
              <ProtectedRoute adminOnly>
                <ManageRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/attendance"
            element={
              <ProtectedRoute adminOnly>
                <ManageAttendance />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
