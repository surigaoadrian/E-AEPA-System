import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = sessionStorage.getItem("userRole");

  console.log("Token:", token); 
  console.log("User Role:", userRole); 
  console.log("Required Roles:", requiredRoles); 

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!requiredRoles.includes(userRole)) {
    return <Navigate to="/notAuthorized" />;
  }

  return children;
};

export default PrivateRoute;
