// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { checkUserRole } from "../../utils/checkUserRole";

// const ProtectedRouteAdmin = () => {
//   const token = sessionStorage.getItem("accessToken");
//   const getUser = sessionStorage.getItem("user");
//   // const getRole = JSON.parse(getUser).role;

//   const isAdmin = checkUserRole(token, "admin");

//   return isAdmin ? <Outlet /> : <Navigate to="*" />;
// };

// export default ProtectedRouteAdmin;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkUserRole } from "../../utils/checkUserRole";

const ProtectedRouteByRole = () => {
  const token = sessionStorage.getItem("accessToken");
  const isAdminOrSeller = checkUserRole(token, ["admin", "seller"]);
  return isAdminOrSeller ? <Outlet /> : <Navigate to="*" />;
};

export default ProtectedRouteByRole;
