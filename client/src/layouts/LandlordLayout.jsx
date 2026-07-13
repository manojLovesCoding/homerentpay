import React from "react";
import { Outlet } from "react-router-dom";
import LandlordSidebar from "../components/landlord/Sidebar";

const LandlordLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <LandlordSidebar />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pt-16 md:pt-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default LandlordLayout;