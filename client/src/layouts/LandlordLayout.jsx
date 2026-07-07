import React from "react";
import { Outlet } from "react-router-dom";
import LandlordSidebar from "../components/landlord/Sidebar";

const LandlordLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <LandlordSidebar />

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <Outlet />
      </main>

    </div>
  );
};

export default LandlordLayout;