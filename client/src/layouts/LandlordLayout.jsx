import React from "react";
import { Outlet } from "react-router-dom";
import LandlordSidebar from "../components/landlord/Sidebar";


const LandlordLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <LandlordSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default LandlordLayout;