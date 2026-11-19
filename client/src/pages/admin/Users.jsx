import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";
import { toast } from "react-hot-toast";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const res = await api.get("/auth/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  // =====================================================
  // MODAL HANDLERS
  // =====================================================

  const closeModal = () => {
    if (submitting) return;

    setModalType(null);
    setSelectedUser(null);
    setFormData(initialFormData);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormData(initialFormData);
    setModalType("create");
  };

  const openEditModal = (user) => {
    setSelectedUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
    });

    setModalType("edit");
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setFormData(initialFormData);
    setModalType("password");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // CREATE LANDLORD
  // =====================================================

  const handleCreateLandlord = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/auth/create-landlord", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      toast.success("Landlord created successfully");

      setModalType(null);
      setFormData(initialFormData);

      await fetchUsers();
    } catch (error) {
      console.error("Create Landlord Error:", error);

      toast.error(error.response?.data?.message || "Failed to create landlord");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // UPDATE LANDLORD DETAILS
  // =====================================================

  const handleUpdateLandlord = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);

      await api.put(`/auth/landlord/${selectedUser._id}`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      toast.success("Landlord details updated successfully");

      setModalType(null);
      setSelectedUser(null);
      setFormData(initialFormData);

      await fetchUsers();
    } catch (error) {
      console.error("Update Landlord Error:", error);

      toast.error(error.response?.data?.message || "Failed to update landlord");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DEACTIVATE LANDLORD
  // =====================================================

  const handleDeactivate = async (user) => {
    if (user.role !== "landlord") {
      toast.error("Only landlord accounts can be deactivated here");
      return;
    }

    const confirmDeactivate = window.confirm(
      `Are you sure you want to deactivate ${user.name}'s account?`,
    );

    if (!confirmDeactivate) return;

    try {
      await api.patch(`/auth/landlord/${user._id}/deactivate`);

      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id ? { ...item, isActive: false } : item,
        ),
      );

      toast.success("Landlord deactivated successfully");
    } catch (error) {
      console.error("Deactivate Landlord Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to deactivate landlord",
      );
    }
  };

  // =====================================================
  // UPDATE LANDLORD PASSWORD
  // =====================================================

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      toast.error("Please enter a new password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);

      await api.put(`/auth/landlord/${selectedUser._id}/password`, {
        password: formData.password,
      });

      toast.success("Landlord password updated successfully");

      setModalType(null);
      setSelectedUser(null);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Update Password Error:", error);

      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.phone?.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const active = user.isActive !== false;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && active) ||
        (statusFilter === "inactive" && !active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // =====================================================
  // HELPER FUNCTIONS
  // =====================================================

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
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

  const activeUsers = users.filter((user) => user.isActive !== false).length;

  const inactiveUsers = users.length - activeUsers;

  // =====================================================
  // LOADING UI
  // =====================================================

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

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* ================= HEADER ================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-blue-100 sm:p-8">
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
                  {activeUsers}
                </p>
                <p className="text-[11px] text-blue-100 sm:text-xs">Active</p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                <p className="text-xl font-bold text-red-200 sm:text-2xl">
                  {inactiveUsers}
                </p>
                <p className="text-[11px] text-blue-100 sm:text-xs">Inactive</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CREATE LANDLORD ================= */}

        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-bold text-slate-800">Landlord Management</h2>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage landlord accounts, details and passwords.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-500"
          >
            <span className="text-lg">+</span>
            Create Landlord
          </button>
        </section>

        {/* ================= FILTERS ================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
            <table className="w-full min-w-[1100px] text-left">
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
                  filteredUsers.map((user) => {
                    const isActive = user.isActive !== false;

                    return (
                      <tr
                        key={user._id}
                        className="group transition hover:bg-blue-50/40"
                      >
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

                        <td className="px-6 py-5">
                          <p className="max-w-[230px] truncate text-sm font-medium text-slate-700">
                            {user.email}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {user.phone || "No phone number"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ${getRoleStyle(
                              user.role,
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />

                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {user.role === "landlord" && (
                              <>
                                <button
                                  onClick={() => openEditModal(user)}
                                  className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => openPasswordModal(user)}
                                  className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                                >
                                  Password
                                </button>

                                {isActive && (
                                  <button
                                    onClick={() => handleDeactivate(user)}
                                    className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                                  >
                                    Deactivate
                                  </button>
                                )}
                              </>
                            )}

                            {user.role === "admin" && (
                              <span className="px-3 py-2 text-xs font-medium text-slate-400">
                                No actions
                              </span>
                            )}

                            {!isActive && user.role !== "admin" && (
                              <span className="px-3 py-2 text-xs font-medium text-red-500">
                                Deactivated
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
            filteredUsers.map((user) => {
              const isActive = user.isActive !== false;

              return (
                <div
                  key={user._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
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
                            isActive ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />

                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  {user.role === "landlord" && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        Edit Details
                      </button>

                      <button
                        onClick={() => openPasswordModal(user)}
                        className="rounded-xl border border-violet-200 bg-violet-50 py-2.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
                      >
                        Update Password
                      </button>

                      {isActive && (
                        <button
                          onClick={() => handleDeactivate(user)}
                          className="col-span-2 rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                        >
                          Deactivate Landlord
                        </button>
                      )}

                      {!isActive && (
                        <p className="col-span-2 py-2 text-center text-xs font-semibold text-red-500">
                          This landlord account is deactivated
                        </p>
                      )}
                    </div>
                  )}

                  {user.role === "admin" && (
                    <p className="mt-4 text-center text-xs text-slate-400">
                      Administrator account
                    </p>
                  )}
                </div>
              );
            })
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

      {/* =====================================================
          LANDLORD MODALS
      ====================================================== */}

      {modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Admin / Landlord Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {modalType === "create" && "Create Landlord"}
                  {modalType === "edit" && "Update Landlord Details"}
                  {modalType === "password" && "Update Landlord Password"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {modalType === "create" &&
                    "Enter the details to create a new landlord account."}

                  {modalType === "edit" &&
                    `Update the account details for ${selectedUser?.name}.`}

                  {modalType === "password" &&
                    `Set a new password for ${selectedUser?.name}.`}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 disabled:opacity-50"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={
                modalType === "create"
                  ? handleCreateLandlord
                  : modalType === "edit"
                    ? handleUpdateLandlord
                    : handleUpdatePassword
              }
              className="space-y-5 p-6 sm:p-7"
            >
              {(modalType === "create" || modalType === "edit") && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter landlord name"
                      required
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="landlord@example.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      autoComplete="tel"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </>
              )}

              {modalType === "create" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Initial Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter initial password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Password must contain at least 6 characters.
                  </p>
                </div>
              )}

              {modalType === "password" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    New password must contain at least 6 characters.
                  </p>
                </div>
              )}

              {modalType === "create" && (
                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
                    🏢
                  </div>

                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Landlord Account
                    </p>

                    <p className="text-xs text-blue-700">
                      The account role will automatically be set to Landlord.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:from-blue-600 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {submitting
                    ? "Please wait..."
                    : modalType === "create"
                      ? "Create Landlord"
                      : modalType === "edit"
                        ? "Save Changes"
                        : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
