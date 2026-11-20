
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
      />

      <main
        className={`min-h-screen min-w-0 overflow-x-hidden pt-14 transition-[margin] duration-300 ease-in-out md:pt-0 ${
          sidebarCollapsed ? "md:ml-[76px]" : "md:ml-[250px]"
        }`}
      >
        <div className="min-h-screen w-full p-2 sm:p-3 lg:p-4">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
