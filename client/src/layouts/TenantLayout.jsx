import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/tenant/Sidebar";

const TenantLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-h-screen pt-16 md:ml-64 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default TenantLayout;
