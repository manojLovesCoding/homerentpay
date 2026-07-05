import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { label: "Dashboard", path: "" },
    { label: "Users", path: "users" },
    { label: "Properties", path: "properties" },
    { label: "Payments", path: "payments" },
    { label: "Reports", path: "reports" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          🧑‍💼 Admin Dashboard
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === ""}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <div
          onClick={handleLogout}
          className="px-4 py-3 rounded-lg cursor-pointer text-red-600 hover:bg-red-50"
        >
          Logout
        </div>
      </nav>

      <div className="p-4 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} Rent System
      </div>
    </div>
  );
};

export default AdminSidebar;