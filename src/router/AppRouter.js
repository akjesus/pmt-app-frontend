import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminManagement from "../pages/Admin/FleetManagement";
import AdminReports from "../pages/Admin/Reports";
import AdminLayout from "../components/AdminLayout";

// Staff Pages
import StaffDashboard from "../pages/Staff/Dashboard";
import Profile from "../pages/Staff/Profile";
import Results from "../pages/Staff/Results";
import StaffLayout from "../components/StaffLayout";
import Settings from "../pages/Staff/Settings";
import LoadingInfo from "../pages/Admin/LoadingInfo"
import Expenses from "../pages/Admin/Expenses";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Routes (protected + wrapped in AdminLayout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="fleet-management" element={<AdminManagement />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="loading-info" element={<LoadingInfo />} />
        <Route path="bus-expenses" element={<Expenses />} />



      </Route>

      {/* Staff Routes (protected + wrapped in StaffLayout) */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={["Staff"]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="results" element={<Results />} />
         <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
