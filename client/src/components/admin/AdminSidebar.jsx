
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  House,
  CreditCard,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = ({ collapsed = false, onToggle = () => {} }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "", icon: LayoutDashboard, description: "Overview" },
    { label: "Users", path: "users", icon: Users, description: "Manage users" },
    { label: "Properties", path: "properties", icon: House, description: "Manage listings" },
    { label: "Payments", path: "payments", icon: CreditCard, description: "Transactions" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const SidebarContent = ({ mobile = false }) => {
    const isCollapsed = collapsed && !mobile;

    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F7F4EA]">
        {/* BRAND */}
        <div
          className={`relative flex h-[68px] shrink-0 items-center border-b border-[#E6E3D9] ${
            isCollapsed ? "justify-center px-3" : "justify-between px-4"
          }`}
        >
          <div className={`flex min-w-0 items-center ${isCollapsed ? "justify-center" : "gap-2.5"}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-[#E6E3D9]">
              <img
                src="/logo.jpg"
                alt="HomeBridge logo"
                className="h-9 w-9 object-contain"
              />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-base font-extrabold tracking-tight text-[#242B26]">
                  HomeBridge
                </h1>
                <p className="truncate text-[10px] text-[#68756A]">
                  Find Your Space. Make It Home.
                </p>
              </div>
            )}
          </div>

          {!mobile && (
            <button
              type="button"
              onClick={onToggle}
              className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#527C61] transition hover:bg-[#E5ECE2] hover:text-[#244B3C] md:flex ${
                isCollapsed
                  ? "absolute -right-3 top-5 z-20 border border-[#DCE5D9] bg-[#F7F4EA] shadow-sm"
                  : ""
              }`}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={17} />
              ) : (
                <PanelLeftClose size={17} />
              )}
            </button>
          )}

          {mobile && (
            <button
              type="button"
              onClick={closeMobileMenu}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#68756A] transition hover:bg-[#E8EDE5] hover:text-[#244B3C]"
              aria-label="Close menu"
            >
              <X size={19} />
            </button>
          )}
        </div>

        {/* ADMIN PROFILE */}
        <div className="shrink-0 border-b border-[#E6E3D9] px-3 py-2.5">
          <div
            className={`flex items-center rounded-xl border border-[#DCE5D9] bg-gradient-to-br from-[#EAF0E7] to-[#F3F0E5] ${
              isCollapsed ? "justify-center p-2" : "gap-2.5 px-2.5 py-2"
            }`}
            title={isCollapsed ? "Administrator — Online" : undefined}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#244B3C] text-white shadow-sm">
              <ShieldCheck size={19} />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#26372D]">
                  Administrator
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#527C61]" />
                  <span className="text-[10px] text-[#68756A]">Online</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION - NO SCROLLBAR */}
        <nav className="min-h-0 flex-1 overflow-hidden px-2.5 py-3">
          {!isCollapsed && (
            <p className="mb-2 px-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#899489]">
              Management
            </p>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === ""}
                  onClick={mobile ? closeMobileMenu : undefined}
                  title={isCollapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={({ isActive }) => `
                    group relative flex items-center rounded-lg py-1.5 transition-all duration-200
                    ${isCollapsed ? "justify-center px-1.5" : "gap-2.5 px-2"}
                    ${
                      isActive
                        ? "bg-[#E5ECE2] text-[#244B3C] shadow-sm"
                        : "text-[#526056] hover:bg-white/80 hover:text-[#244B3C]"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#244B3C]" />
                      )}

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-[#244B3C] text-white shadow-sm"
                            : "bg-[#ECEEE7] text-[#68756A] group-hover:bg-[#DCE6D9] group-hover:text-[#244B3C]"
                        }`}
                      >
                        <Icon size={17} strokeWidth={2} />
                      </span>

                      {!isCollapsed && (
                        <>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold">
                              {item.label}
                            </span>
                            <span
                              className={`mt-0.5 block truncate text-[9px] ${
                                isActive ? "text-[#527C61]" : "text-[#899489]"
                              }`}
                            >
                              {item.description}
                            </span>
                          </span>

                          <ArrowUpRight
                            size={14}
                            className={`shrink-0 transition-all duration-200 ${
                              isActive
                                ? "text-[#527C61]"
                                : "-translate-x-1 text-[#A8BDA5] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            }`}
                          />
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* LOGOUT - FIXED AT BOTTOM */}
        <div className="shrink-0 border-t border-[#E6E3D9] px-2.5 py-2">
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            aria-label="Logout"
            className={`group flex w-full items-center rounded-lg py-2 text-left text-[#9B5148] transition-all duration-200 hover:bg-[#F5E9E5] hover:text-[#873F37] ${
              isCollapsed ? "justify-center px-1.5" : "gap-2.5 px-2"
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2E7E2] text-[#9B5148] transition group-hover:bg-[#EEDBD4]">
              <LogOut size={17} />
            </span>

            {!isCollapsed && (
              <span className="flex-1">
                <span className="block text-xs font-semibold">Logout</span>
                <span className="mt-0.5 block text-[9px] text-[#B17A70]">
                  Sign out of account
                </span>
              </span>
            )}
          </button>
        </div>

        {/* FOOTER */}
        <div className={`shrink-0 border-t border-[#E6E3D9] ${isCollapsed ? "p-2" : "px-3 py-2"}`}>
          {isCollapsed ? (
            <div className="flex justify-center" title="HomeBridge Admin Console">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[10px] font-extrabold text-[#527C61] ring-1 ring-[#E6E3D9]">
                HB
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold text-[#34463A]">
                  HomeBridge
                </p>
                <p className="text-[9px] text-[#899489]">Admin Console</p>
              </div>
              <span className="rounded-md bg-[#EAF0E7] px-2 py-1 text-[9px] font-bold text-[#527C61]">
                v1.0
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-[#E6E3D9] bg-[#F7F4EA]/95 px-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8EDE5] text-[#244B3C] transition hover:bg-[#DCE6D9]"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu size={20} />
        </button>

        <div className="ml-2.5 flex min-w-0 items-center gap-2">
          <img
            src="/logo.jpg"
            alt="HomeBridge"
            className="h-8 w-8 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-[#242B26]">
              HomeBridge
            </p>
            <p className="truncate text-[9px] text-[#68756A]">
              Admin Console
            </p>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 cursor-default bg-[#17251D]/40 md:hidden"
        />
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen overflow-hidden border-r border-[#E6E3D9] shadow-sm transition-[width] duration-300 ease-in-out md:block ${
          collapsed ? "w-[76px]" : "w-[250px]"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] overflow-hidden shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent mobile />
      </aside>
    </>
  );
};

export default AdminSidebar;
