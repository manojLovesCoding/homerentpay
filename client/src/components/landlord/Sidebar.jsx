import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LandlordSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "" },
    { label: "Properties", path: "properties" },
    { label: "Add Property", path: "add-property" },
    { label: "Tenants", path: "tenants" },
    { label: "Assigned Tenants", path: "assigned-tenants" },
    { label: "Payments", path: "payments" },

  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0
          h-screen w-64
          bg-white shadow-lg
          flex flex-col
          z-40
          transform transition-transform duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">
            🏢 Landlord Panel
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === ""}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-sm text-center text-gray-500">
          © {new Date().getFullYear()} Rent System
        </div>
      </aside>
    </>
  );
};

export default LandlordSidebar;