
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  Wallet,
  History,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/tenant",
      icon: Home,
      end: true,
    },
    {
      label: "My Property",
      path: "/tenant/property",
      icon: Building2,
    },
    {
      label: "Rent Status",
      path: "/tenant/rent",
      icon: Wallet,
    },
    {
      label: "Payment History",
      path: "/tenant/history",
      icon: History,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => setOpen(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#244B3C] text-white shadow-sm"
        : "text-[#526056] hover:bg-[#EEF1E9] hover:text-[#244B3C]"
    }`;

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F7F4EA]">
      {/* Brand */}
      <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#E6E3D9] px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="HomeBridge"
            className="h-9 w-9 shrink-0 rounded-lg object-contain"
          />

          {(!collapsed || mobile) && (
            <span className="truncate text-lg font-bold tracking-tight text-[#244B3C]">
              HomeBridge
            </span>
          )}
        </div>

        {mobile && (
          <button
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-[#526056] transition hover:bg-[#E9EDE5]"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        )}

        {!mobile && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-[76px] z-20 hidden h-7 w-7 items-center justify-center rounded-full border border-[#E6E3D9] bg-white text-[#244B3C] shadow-sm transition hover:bg-[#EEF1E9] md:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={15} />
            ) : (
              <ChevronLeft size={15} />
            )}
          </button>
        )}
      </div>

      {/* Tenant profile */}
      <div
        className={`flex shrink-0 items-center border-b border-[#E6E3D9] px-4 py-3 ${
          collapsed && !mobile ? "justify-center" : "gap-3"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCE6D9] text-[#244B3C]">
          <UserRound size={18} />
        </div>

        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#242B26]">
              {user?.name || "Tenant"}
            </p>
            <p className="text-xs text-[#68756A]">Tenant Account</p>
          </div>
        )}
      </div>

      {/* Navigation - no sidebar scrolling */}
      <nav className="flex-1 overflow-hidden px-3 py-3">
        {(!collapsed || mobile) && (
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#879187]">
            Menu
          </p>
        )}

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={mobile ? closeMobileMenu : undefined}
                title={collapsed && !mobile ? item.label : undefined}
                className={linkClasses}
              >
                <Icon size={19} className="shrink-0" />

                {(!collapsed || mobile) && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-[#E6E3D9] p-3">
        <button
          onClick={handleLogout}
          title={collapsed && !mobile ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#A34D42] transition hover:bg-[#F5E8E4] ${
            collapsed && !mobile ? "justify-center" : ""
          }`}
        >
          <LogOut size={19} className="shrink-0" />

          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#E6E3D9] bg-[#F7F4EA] px-4 md:hidden">
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="HomeBridge"
            className="h-8 w-8 object-contain"
          />
          <span className="text-base font-bold text-[#244B3C]">
            HomeBridge
          </span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-[#244B3C] hover:bg-[#E9EDE5]"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen overflow-hidden border-r border-[#E6E3D9] transition-[width] duration-300 md:block ${
          collapsed ? "w-[76px]" : "w-[250px]"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] overflow-hidden shadow-xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent mobile />
      </aside>
    </>
  );
};

export default Sidebar;
