import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/StudentHome';
import EmployerDashboard from './pages/EmployerDashboard';
import MyApplications from './pages/MyApplications';
import MyFavorites from './pages/MyFavorites';
import JobDetail from './pages/JobDetail';
import StudentProfile from './pages/StudentProfile';
import EmployerProfile from './pages/EmployerProfile';
import PostJob from './pages/PostJob';
import MyPosts from './pages/MyPosts';
import ProfileViews from './pages/ProfileViews';
import EditJob from './pages/EditJob';
import StudentPublicProfile from './pages/StudentPublicProfile';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import JobAlerts from './pages/JobAlerts';
import EmployerMetrics from './pages/EmployerMetrics';
import ResetPassword from './pages/ResetPassword';
import JobApplicants from './pages/JobApplicants';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.userType !== 'ADMIN') return <Navigate to="/login" replace />;
  return children;
};

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-gray-600 text-sm">Cargando...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.userType !== role) return <Navigate to="/" replace />;
  return children;
};

const Root = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Landing />;
  return <Navigate to={user.userType === 'STUDENT' ? '/home' : '/employer/dashboard'} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<PrivateRoute role="STUDENT"><StudentHome /></PrivateRoute>} />
          <Route path="/jobs/:id" element={<PrivateRoute><JobDetail /></PrivateRoute>} />
          <Route path="/my-applications" element={<PrivateRoute role="STUDENT"><MyApplications /></PrivateRoute>} />
          <Route path="/my-favorites" element={<PrivateRoute role="STUDENT"><MyFavorites /></PrivateRoute>} />
          <Route path="/student/profile" element={<PrivateRoute role="STUDENT"><StudentProfile /></PrivateRoute>} />
          <Route path="/employer/dashboard" element={<PrivateRoute role="EMPLOYER"><EmployerDashboard /></PrivateRoute>} />
          <Route path="/employer/profile" element={<PrivateRoute role="EMPLOYER"><EmployerProfile /></PrivateRoute>} />
          <Route path="/employer/post-job" element={<PrivateRoute role="EMPLOYER"><PostJob /></PrivateRoute>} />
          <Route path="/student/public/:studentId" element={<PrivateRoute role="EMPLOYER"><StudentPublicProfile /></PrivateRoute>} />
          <Route path="/employer/edit-job/:id" element={<PrivateRoute role="EMPLOYER"><EditJob /></PrivateRoute>} />
          <Route path="/profile-views" element={<PrivateRoute role="STUDENT"><ProfileViews /></PrivateRoute>} />
          <Route path="/employer/my-posts" element={<PrivateRoute role="EMPLOYER"><MyPosts /></PrivateRoute>} />
          <Route path="/employer/applicants/:jobId" element={<PrivateRoute role="EMPLOYER"><JobApplicants /></PrivateRoute>} />
          <Route path="/employer/metrics" element={<PrivateRoute role="EMPLOYER"><EmployerMetrics /></PrivateRoute>} />
          <Route path="/job-alerts" element={<PrivateRoute role="STUDENT"><JobAlerts /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
