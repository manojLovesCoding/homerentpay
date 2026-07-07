import { Outlet } from "react-router-dom";
import Sidebar from "../components/tenant/Sidebar";

const TenantLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <Outlet />
      </main>

    </div>
  );
};

export default TenantLayout;