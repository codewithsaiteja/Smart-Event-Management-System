import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while we validate the token


  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        // No token at all — definitely a guest
        setLoading(false);
        return;
      }

      try {
        // Verify token with the server — throws if 401
        const response = await authService.getProfile();
        setUser(response.user);          // trust server, not localStorage
      } catch {
        // Token is invalid or expired — clear everything and treat as guest
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (data) => {
    try {
      const response = await authService.login(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the server call fails, always clear local state
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
