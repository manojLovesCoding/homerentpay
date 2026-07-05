import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";


const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">

      <div className="w-64 bg-white shadow-md">
        <AdminSidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;