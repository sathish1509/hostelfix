/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../services/authService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Wrap in setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      const storedUser = getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    }, 0);
  }, []);

  const login = async (email, password, role) => {
    try {
      const { user } = await loginUser(email, password, role);
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on role
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'warden') navigate('/warden/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      
      return true;
    } catch (error) {
      toast.error(error.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    navigate('/login');
    toast.success("Logged out successfully");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
