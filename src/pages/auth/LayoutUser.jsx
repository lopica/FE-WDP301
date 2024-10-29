import React from "react";
import { Outlet } from "react-router-dom";
import SideBarUser from "../../components/SideBarUser";
const LayoutUser = () => {
  return (
    <div className="flex bg-[#F5F6FA]">
      <SideBarUser />
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutUser;
