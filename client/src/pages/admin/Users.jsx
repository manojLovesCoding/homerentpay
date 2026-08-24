import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this user?",
    );

    if (!confirmDeactivate) return;

    try {
      await api.patch(`/auth/tenant/${id}/deactivate`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isActive: false,
              }
            : user,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.phone?.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700 ring-purple-200";

      case "landlord":
        return "bg-blue-50 text-blue-700 ring-blue-200";

      case "tenant":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";

      default:
        return "bg-gray-50 text-gray-700 ring-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-36 rounded-3xl bg-white shadow-sm" />

          <div className="h-20 rounded-2xl bg-white shadow-sm" />

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-16 rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* ================= HEADER ================= */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-blue-100 sm:p-8">
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                User Management
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Users
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Manage tenants, landlords and administrators from one
                centralized dashboard.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                <p className="text-xl font-bold sm:text-2xl">{users.length}</p>
                <p className="text-[11px] text-blue-100 sm:text-xs">Total</p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                <p className="text-xl font-bold text-emerald-200 sm:text-2xl">
                  {users.filter((user) => user.isActive).length}
                </p>
                <p className="text-[11px] text-blue-100 sm:text-xs">Active</p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                <p className="text-xl font-bold text-red-200 sm:text-2xl">
                  {users.filter((user) => !user.isActive).length}
                </p>
                <p className="text-[11px] text-blue-100 sm:text-xs">Inactive</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FILTERS ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="all">All Roles</option>
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
              <option value="admin">Admin</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {(search || roleFilter !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">{users.length}</span>{" "}
            users
          </div>
        </section>

        {/* ================= DESKTOP TABLE ================= */}
        <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="group transition hover:bg-blue-50/40"
                    >
                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                            {getInitials(user.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID: {user._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-5">
                        <p className="max-w-[230px] truncate text-sm font-medium text-slate-700">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {user.phone || "No phone number"}
                        </p>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ${getRoleStyle(
                            user.role,
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.isActive ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />

                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {user.role === "tenant" && user.isActive && (
                            <button
                              onClick={() => handleDeactivate(user._id)}
                              className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                            >
                              Block
                            </button>
                          )}

                          <button className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
                            View
                          </button>

                          <button className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                          👥
                        </div>

                        <h3 className="font-bold text-slate-800">
                          No users found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or filter options.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= MOBILE CARDS ================= */}
        <section className="space-y-4 md:hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* User header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-sm">
                      {getInitials(user.name)}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-800">
                        {user.name}
                      </h3>

                      <p className="truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${getRoleStyle(
                      user.role,
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-slate-700">
                      {user.phone || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </p>

                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                          user.isActive ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isActive ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />

                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
                    View
                  </button>

                  {user.role === "tenant" && user.isActive && (
                    <button
                      onClick={() => handleDeactivate(user._id)}
                      className="flex-1 rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                    >
                      Block
                    </button>
                  )}

                  <button className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                👥
              </div>

              <h3 className="font-bold text-slate-800">No users found</h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Users;
