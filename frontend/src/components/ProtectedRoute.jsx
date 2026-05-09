import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { shopcontext } from "../context/shopcontext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(shopcontext);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
