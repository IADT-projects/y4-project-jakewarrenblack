import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, redirect } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../utils/AuthContext";

function ProtectedRoute() {
  const { token } = useContext(AuthContext);

  // If no user received from context, redirect to the login page
  //console.log('printing user from context:', user)

  if (!token) {
    return (
      <Navigate
        to={"/"}
        state={{ msg: "Please sign in to access that page." }}
      />
    );
  }

  // Otherwise, go to the protected route
  return <Outlet />;
}

export default ProtectedRoute;
