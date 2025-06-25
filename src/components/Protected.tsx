import { useAuth } from "@/contexts/AuthContext";
import React from "react";

import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = "/",
  children,
}) => {
    const {state}=useAuth();
    const {isAuthenticated, user,loading} = state;
 if(user){
  console.log("user role", user);
 }
    if (loading) {
      return <div className="p-6 text-center">Loading...</div>;
    }
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Render children or <Outlet /> for nested routes
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
