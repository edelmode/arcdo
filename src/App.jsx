import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import HTEDashboardPage from './pages/HTEDashboardPage';
import OJTCoordinatorsPage from './pages/OJTCoordinatorsPage';
import IndustryPartnersPage from './pages/IndustryPartnersPage';
import OverviewPage from './pages/OverviewPage';
import AdminProfile from './components/account/AdminProfile';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPasswordCard';
import AbouttheDeveloperPage from './pages/AbouttheDeveloperPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3001/api/auth/verify-token", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          const data = await response.json();
          if (data.error === "Token expired" || data.error === "Invalid token") {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user_id");
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // Prevents unnecessary logout on network errors
        setIsAuthenticated(true);
      }
    };
  
    verifyToken();
  }, []);
  

  return (
    <Router>
      <Routes>
        {/* Prevents authenticated users from accessing login/signup */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/overview" /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/overview" /> : <LandingPage />} />
        <Route path="/signUp" element={isAuthenticated ? <Navigate to="/overview" /> : <SignUp />} />
        <Route path="/forgotPassword" element={isAuthenticated ? <Navigate to="/overview" /> : <ForgotPassword />} />
        <Route path="/reset-password" element={isAuthenticated ? <Navigate to="/overview" /> : <ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/hte" element={<HTEDashboardPage />} />
          <Route path="/OJT-coordinators" element={<OJTCoordinatorsPage />} />
          <Route path="/industry-partners" element={<IndustryPartnersPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/adminprofile" element={<AdminProfile />} />
          <Route path="/about-the-developer" element={<AbouttheDeveloperPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
