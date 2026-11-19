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

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
          aria-label="Open menu"
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="ml-3 flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Blue Bridge Housing"
            className="h-10 w-10 rounded-lg object-contain"
          />

          <div>
            <p className="text-sm font-bold text-slate-900">HomeBridge</p>

            <p className="text-[10px] text-slate-500">
              Find Your Space. Make It Home.
            </p>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64
          flex-col
          border-r border-slate-200
          bg-white
          shadow-2xl shadow-slate-900/10
          transition-transform duration-300 ease-out
          md:z-30 md:translate-x-0 md:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* BRAND */}
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex w-full items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Blue Bridge Housing Logo"
              className="h-12 w-12 shrink-0 rounded-xl object-contain"
            />

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900">
                HomeBridge
              </h1>

              <p className="mt-1 text-[10px] font-medium leading-relaxed text-slate-500">
                Find Your Space. Make It Home.
              </p>
            </div>

            {/* MOBILE CLOSE BUTTON */}
            <button
              onClick={closeMenu}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 md:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ADMIN PROFILE */}
        <div className="px-4 pt-5">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 shadow-md shadow-blue-200">
                <span className="font-bold text-white">A</span>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  Administrator
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-xs text-slate-500">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Management
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ""}
                onClick={closeMenu}
                className={({ isActive }) => `
                  group relative flex items-center gap-3
                  rounded-xl px-3 py-3
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* ACTIVE INDICATOR */}
                    {isActive && (
                      <span className="absolute bottom-2.5 left-0 top-2.5 w-1 rounded-r-full bg-blue-700" />
                    )}

                    {/* ICON */}
                    <span
                      className={`
                        flex h-10 w-10 items-center justify-center
                        rounded-xl text-lg transition-all
                        ${
                          isActive
                            ? "bg-blue-700 text-white shadow-md shadow-blue-200"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    {/* LABEL AND DESCRIPTION */}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {item.label}
                      </span>

                      <span
                        className={`
                          mt-0.5 block text-[11px]
                          ${isActive ? "text-blue-600" : "text-slate-400"}
                        `}
                      >
                        {item.description}
                      </span>
                    </span>

                    {/* ARROW */}
                    <span
                      className={`
                        text-sm transition-transform
                        ${
                          isActive
                            ? "translate-x-0 text-blue-600"
                            : "-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
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

          {/* SYSTEM */}
          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            System
          </p>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              group flex w-full items-center gap-3
              rounded-xl px-3 py-3
              text-left text-red-500
              transition-all duration-200
              hover:bg-red-50 hover:text-red-600
            "
          >
            <span
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-red-50 text-lg
                transition group-hover:bg-red-100
              "
            >
              ↪
            </span>

            <span className="flex-1">
              <span className="block text-sm font-semibold">Logout</span>

              <span className="mt-0.5 block text-[11px] text-red-300">
                Sign out of account
              </span>
            </span>
          </button>
        </nav>

        {/* FOOTER */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  HomeBridge
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Admin Console
                </p>
              </div>

              <span className="text-[10px] font-semibold text-slate-400">
                v1.0
              </span>
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-400">
            © {new Date().getFullYear()} HomeBridge. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
