import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loading } from "../ui/Loading";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading label="Checking session" />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return <Outlet />;
}
