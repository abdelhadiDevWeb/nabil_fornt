import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from '@getmocha/users-service/react';
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import AdminDashboard from "@/react-app/pages/AdminDashboard";
import EmployeeDashboard from "@/react-app/pages/EmployeeDashboard";
import LoginPage from "@/react-app/pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
