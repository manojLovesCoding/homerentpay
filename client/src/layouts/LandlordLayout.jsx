import React from "react";
import { Outlet } from "react-router-dom";
import LandlordSidebar from "../components/landlord/Sidebar";

const LandlordLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <LandlordSidebar />

      {/* Main content */}
      <main className="min-h-screen overflow-x-hidden pt-16 md:ml-64 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default LandlordLayout;