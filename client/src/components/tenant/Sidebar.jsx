import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "" },
    { label: "My Property", path: "property" },
    { label: "Monthly Rent", path: "rent" },
    { label: "Payment History", path: "history" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg"
      >
        ☰
      </button>


      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-30"
        />
      )}


      {/* Sidebar */}
      <aside
        className={`
  fixed md:sticky
  top-0 left-0
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

        <div className="p-6 border-b">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">
            🏠 Home Rent
          </h1>
        </div>


        <nav className="flex-1 p-4 space-y-2">

          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === ""}
              onClick={() => setOpen(false)}
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
          © {new Date().getFullYear()} Home Rent
        </div>

      </aside>
    </>
  );
};

export default Sidebar;