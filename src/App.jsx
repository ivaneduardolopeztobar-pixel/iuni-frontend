import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentHome from "./pages/StudentHome";
import EmployerDashboard from "./pages/EmployerDashboard";
import MyApplications from "./pages/MyApplications";
import MyFavorites from "./pages/MyFavorites";
import JobDetail from "./pages/JobDetail";
import StudentProfile from "./pages/StudentProfile";
import EmployerProfile from "./pages/EmployerProfile";
import PostJob from "./pages/PostJob";
import MyPosts from "./pages/MyPosts";
import ProfileViews from "./pages/ProfileViews";
import EditJob from "./pages/EditJob";
import StudentPublicProfile from "./pages/StudentPublicProfile";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import JobApplicants from "./pages/JobApplicants";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import JobAlerts from "./pages/JobAlerts";
import EmployerMetrics from "./pages/EmployerMetrics";
import Onboarding from "./pages/Onboarding";

const Loading = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <p className="text-gray-600 text-sm">Cargando...</p>
  </div>
);

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.userType !== role) {
    if (user.userType === "STUDENT") return <Navigate to="/home" replace />;
    if (user.userType === "EMPLOYER") return <Navigate to="/employer/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user || user.userType !== "ADMIN") return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) {
    if (user.userType === "STUDENT") return <Navigate to="/home" replace />;
    if (user.userType === "EMPLOYER") return <Navigate to="/employer/dashboard" replace />;
    if (user.userType === "ADMIN") return <Navigate to="/admin" replace />;
  }
  return children;
};

const Root = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Landing />;
  if (user.userType === "ADMIN") return <Navigate to="/admin" replace />;
  if (user.userType === "STUDENT") return <Navigate to="/home" replace />;
  return <Navigate to="/employer/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />

          {/* Rutas publicas */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/onboarding" element={<PrivateRoute role="STUDENT"><Onboarding /></PrivateRoute>} />

          {/* Rutas estudiante */}
          <Route path="/home" element={<PrivateRoute role="STUDENT"><StudentHome /></PrivateRoute>} />
          <Route path="/jobs/:id" element={<PrivateRoute><JobDetail /></PrivateRoute>} />
          <Route path="/my-applications" element={<PrivateRoute role="STUDENT"><MyApplications /></PrivateRoute>} />
          <Route path="/my-favorites" element={<PrivateRoute role="STUDENT"><MyFavorites /></PrivateRoute>} />
          <Route path="/student/profile" element={<PrivateRoute role="STUDENT"><StudentProfile /></PrivateRoute>} />
          <Route path="/profile-views" element={<PrivateRoute role="STUDENT"><ProfileViews /></PrivateRoute>} />
          <Route path="/job-alerts" element={<PrivateRoute role="STUDENT"><JobAlerts /></PrivateRoute>} />

          {/* Rutas empleador */}
          <Route path="/employer/dashboard" element={<PrivateRoute role="EMPLOYER"><EmployerDashboard /></PrivateRoute>} />
          <Route path="/employer/profile" element={<PrivateRoute role="EMPLOYER"><EmployerProfile /></PrivateRoute>} />
          <Route path="/employer/post-job" element={<PrivateRoute role="EMPLOYER"><PostJob /></PrivateRoute>} />
          <Route path="/employer/my-posts" element={<PrivateRoute role="EMPLOYER"><MyPosts /></PrivateRoute>} />
          <Route path="/employer/edit-job/:id" element={<PrivateRoute role="EMPLOYER"><EditJob /></PrivateRoute>} />
          <Route path="/employer/applicants/:jobId" element={<PrivateRoute role="EMPLOYER"><JobApplicants /></PrivateRoute>} />
          <Route path="/employer/metrics" element={<PrivateRoute role="EMPLOYER"><EmployerMetrics /></PrivateRoute>} />
          <Route path="/student/public/:studentId" element={<PrivateRoute role="EMPLOYER"><StudentPublicProfile /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
