import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// Student Pages
import StudentDashboard from "../pages/student/Dashboard";
import RaiseComplaint from "../pages/student/RaiseComplaint";
import MyComplaints from "../pages/student/MyComplaints";

// Warden Pages
import WardenDashboard from "../pages/warden/Dashboard";
import Supervision from "../pages/warden/Supervision";
import WardenAnalytics from "../pages/warden/Analytics";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import AllComplaints from "../pages/admin/AllComplaints";
import Rooms from "../pages/admin/Rooms";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/raise-complaint" element={<RaiseComplaint />} />
        <Route path="/student/my-complaints" element={<MyComplaints />} />
      </Route>

      {/* Protected Warden Routes */}
      <Route element={<ProtectedRoute allowedRoles={['warden']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/warden/dashboard" element={<WardenDashboard />} />
        <Route path="/warden/supervision" element={<Supervision />} />
        <Route path="/warden/analytics" element={<WardenAnalytics />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/complaints" element={<AllComplaints />} />
        <Route path="/admin/rooms" element={<Rooms />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
