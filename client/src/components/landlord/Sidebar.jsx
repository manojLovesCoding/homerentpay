import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LandlordSidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      path: "",
      icon: "⌂",
    },
    {
      label: "Properties",
      path: "properties",
      icon: "▣",
    },
    {
      label: "Add Property",
      path: "add-property",
      icon: "+",
    },
    {
      label: "Tenants",
      path: "tenants",
      icon: "♙",
    },
    {
      label: "Assigned Tenants",
      path: "assigned-tenants",
      icon: "◉",
    },
    {
      label: "Payments",
      path: "payments",
      icon: "₹",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {/* =====================================================
          MOBILE TOP BAR
      ====================================================== */}

      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-md md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 active:scale-95"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-md">
            🏢
          </div>

          <span className="font-bold text-slate-900">
            Vayuhu
          </span>
        </div>

        <div className="w-10" />
      </div>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {open && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[280px]
          flex-col overflow-hidden
          border-r border-slate-200
          bg-white
          shadow-2xl shadow-slate-900/10
          transition-transform duration-300 ease-out
          md:z-30 md:w-64 md:translate-x-0 md:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =================================================
            BRAND
        ================================================== */}

        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl text-white shadow-lg shadow-blue-500/20">
              🏢
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900">
                Vayuhu
              </h1>

              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Landlord Portal
              </p>
            </div>

            {/* Close mobile */}

            <button
              onClick={closeMobileMenu}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 md:hidden"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
        </div>

        {/* =================================================
            PROFILE CARD
        ================================================== */}

        <div className="px-4 pt-5">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || "L"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {user?.name || "Landlord"}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {user?.email || "Property Manager"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <div className="px-4 pt-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Main Menu
          </p>
        </div>

        <nav className="mt-3 flex-1 space-y-1.5 overflow-y-auto px-4 pb-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ""}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `
                group relative flex items-center gap-3
                rounded-xl px-3 py-3
                text-sm font-semibold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}

                  {isActive && (
                    <span className="absolute -left-4 h-7 w-1 rounded-r-full bg-blue-600" />
                  )}

                  {/* Icon */}

                  <span
                    className={`
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-lg text-base
                      transition
                      ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                      }
                    `}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}

                  <span className="truncate">{item.label}</span>

                  {/* Arrow */}

                  <span
                    className={`
                      ml-auto text-xs transition-transform
                      ${
                        isActive
                          ? "translate-x-0 text-white/80"
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

          {/* Divider */}

          <div className="my-4 border-t border-slate-100" />

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-base transition group-hover:bg-red-100">
              ↪
            </span>

            <span>Logout</span>

            <span className="ml-auto text-xs opacity-0 transition group-hover:opacity-100">
              →
            </span>
          </button>
        </nav>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 px-3 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

              <span className="text-xs font-medium text-slate-500">
                System Online
              </span>
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              © {new Date().getFullYear()} Vayuhu
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default LandlordSidebar;
