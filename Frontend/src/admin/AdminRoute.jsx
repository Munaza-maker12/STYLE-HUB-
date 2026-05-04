
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("Admin not logged in");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
