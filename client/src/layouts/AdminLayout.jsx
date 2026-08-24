import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="min-h-screen md:ml-64 pt-16 md:pt-0">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;