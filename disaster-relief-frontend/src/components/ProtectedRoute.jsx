import React from "react";
import { Navigate } from "react-router-dom";

// Accepts an array like ["Admin", "NGO", "Volunteer"]
const getUserRole = () => {
  // Adjust this based on how you store the role
  return localStorage.getItem("userRole"); // e.g., "Admin", "NGO", etc
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const userRole = getUserRole();

  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Not authorized
    return (
      <div style={{ marginTop: "64px", textAlign: "center" }}>
        <h3>403 - Not Authorized</h3>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
