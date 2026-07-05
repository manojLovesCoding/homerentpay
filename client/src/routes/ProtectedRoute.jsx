import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useAuth();

  // wait for auth check
  if (loading) return null; // or spinner

  // not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;