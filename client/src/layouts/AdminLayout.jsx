import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <AdminSidebar />

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;