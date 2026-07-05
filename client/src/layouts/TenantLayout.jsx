
import { Outlet } from "react-router-dom";
import Sidebar from "../components/tenant/Sidebar";


const TenantLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default TenantLayout;