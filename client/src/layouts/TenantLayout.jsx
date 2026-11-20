
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/tenant/Sidebar";

const TenantLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
      />

      <main
        className={`min-h-screen pt-14 transition-[margin] duration-300 md:pt-0 ${
          collapsed ? "md:ml-[76px]" : "md:ml-[250px]"
        }`}
      >
        <div className="p-2 sm:p-3 lg:p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TenantLayout;
