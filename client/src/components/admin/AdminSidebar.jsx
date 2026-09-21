import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      path: "",
      icon: "▦",
      description: "Overview",
    },
    {
      label: "Users",
      path: "users",
      icon: "♙",
      description: "Manage users",
    },
    {
      label: "Properties",
      path: "properties",
      icon: "⌂",
      description: "Manage listings",
    },
    {
      label: "Payments",
      path: "payments",
      icon: "₹",
      description: "Transactions",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 z-40 flex items-center px-4">
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          aria-label="Open menu"
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="ml-3 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">A</span>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">Admin Panel</p>

            <p className="text-[11px] text-slate-500">Rent Management</p>
          </div>
        </div>
      </header>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0
          h-screen w-64
          bg-white
          border-r border-slate-200
          flex flex-col
          z-50

          transform transition-transform duration-300 ease-out

          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ================= BRAND ================= */}
        <div className="h-20 px-5 border-b border-slate-100 flex items-center">
          <div className="flex items-center gap-3 w-full">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white text-lg font-bold">A</span>
              </div>

              <span className="absolute -right-1 -bottom-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-slate-900 truncate">
                Admin Panel
              </h1>

              <p className="text-xs text-slate-500 truncate">Rent Management</p>
            </div>

            {/* Close button mobile */}
            <button
              onClick={() => setOpen(false)}
              className="md:hidden w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ================= ADMIN PROFILE ================= */}
        <div className="px-4 pt-5">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  Administrator
                </p>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                  <span className="text-xs text-slate-500">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Management
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ""}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-3
                  px-3 py-3
                  rounded-xl
                  transition-all duration-200

                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-indigo-600" />
                    )}

                    <span
                      className={`
                        w-10 h-10
                        rounded-xl
                        flex items-center justify-center
                        text-lg
                        transition-all

                        ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                            : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold">
                        {item.label}
                      </span>

                      <span
                        className={`
                          block text-[11px] mt-0.5
                          ${isActive ? "text-indigo-500" : "text-slate-400"}
                        `}
                      >
                        {item.description}
                      </span>
                    </span>

                    <span
                      className={`
                        text-sm transition-transform
                        ${
                          isActive
                            ? "text-indigo-500 translate-x-0"
                            : "text-slate-300 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                        }
                      `}
                    >
                      →
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ================= SYSTEM ================= */}
          <p className="px-3 mt-8 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            System
          </p>

          <button
            onClick={handleLogout}
            className="
              group w-full
              flex items-center gap-3
              px-3 py-3
              rounded-xl
              text-left
              text-red-500
              hover:bg-red-50
              hover:text-red-600
              transition-all duration-200
            "
          >
            <span
              className="
              w-10 h-10
              rounded-xl
              bg-red-50
              flex items-center justify-center
              text-lg
              group-hover:bg-red-100
              transition
            "
            >
              ↪
            </span>

            <span className="flex-1">
              <span className="block text-sm font-semibold">Logout</span>

              <span className="block text-[11px] text-red-300 mt-0.5">
                Sign out of account
              </span>
            </span>
          </button>
        </nav>

        {/* ================= FOOTER ================= */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600">
                  Vayuhu
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  Admin Console
                </p>
              </div>

              <span className="text-[10px] font-semibold text-slate-400">
                v1.0
              </span>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-3">
            © {new Date().getFullYear()} Vayuhu
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
