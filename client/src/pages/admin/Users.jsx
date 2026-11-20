
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Users as UsersIcon,
  UserRound,
  Building2,
  ShieldCheck,
  Plus,
  Pencil,
  KeyRound,
  UserX,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

  // FETCH USERS
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

  // MODAL HANDLERS
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

  // CREATE LANDLORD
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

  // UPDATE LANDLORD DETAILS
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

  // DEACTIVATE LANDLORD
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

  // UPDATE LANDLORD PASSWORD
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

  // FILTER USERS
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

  // HELPERS
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
        return "bg-[#F5F0E5] text-[#80612F] ring-[#E8DCC1]";
      case "landlord":
        return "bg-[#EAF0E8] text-[#244B3C] ring-[#DCE7DA]";
      case "tenant":
        return "bg-[#F0F3EC] text-[#527C61] ring-[#DCE7DA]";
      default:
        return "bg-[#F3F4F1] text-[#68756A] ring-[#E6E3D9]";
    }
  };

  const activeUsers = users.filter((user) => user.isActive !== false).length;
  const inactiveUsers = users.length - activeUsers;

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const hasFilters =
    search || roleFilter !== "all" || statusFilter !== "all";

  // LOADING
  if (loading) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-4">
        <div className="mx-auto max-w-7xl animate-pulse space-y-3">
          <div className="h-20 rounded-xl bg-white" />

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-16 rounded-xl bg-white" />
            ))}
          </div>

          <div className="h-14 rounded-xl bg-white" />

          <div className="rounded-xl bg-white p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="mb-2 h-12 rounded-lg bg-[#F0F1EC]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F8F5] p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-7xl space-y-3">

        {/* HEADER */}
        <section className="flex flex-col gap-3 rounded-xl border border-[#E6E3D9] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#527C61]">
              Administration
            </p>

            <h1 className="mt-0.5 text-xl font-bold text-[#242B26] sm:text-2xl">
              Users
            </h1>

            <p className="mt-1 text-xs text-[#68756A] sm:text-sm">
              Manage tenants, landlords and administrators.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[270px]">
            <div className="rounded-lg bg-[#F7F8F5] px-3 py-2 text-center">
              <p className="text-lg font-bold text-[#244B3C]">
                {users.length}
              </p>
              <p className="text-[10px] text-[#68756A]">Total</p>
            </div>

            <div className="rounded-lg bg-[#EAF0E8] px-3 py-2 text-center">
              <p className="text-lg font-bold text-[#244B3C]">
                {activeUsers}
              </p>
              <p className="text-[10px] text-[#527C61]">Active</p>
            </div>

            <div className="rounded-lg bg-[#F8EFEC] px-3 py-2 text-center">
              <p className="text-lg font-bold text-[#A64B3C]">
                {inactiveUsers}
              </p>
              <p className="text-[10px] text-[#A07870]">Inactive</p>
            </div>
          </div>
        </section>

        {/* LANDLORD MANAGEMENT */}
        <section className="flex flex-col gap-3 rounded-xl border border-[#E6E3D9] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#242B26]">
              Landlord Management
            </h2>
            <p className="mt-0.5 text-xs text-[#68756A]">
              Create accounts and manage landlord details and passwords.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#244B3C] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193A2E] active:scale-[0.98]"
          >
            <Plus size={16} />
            Create Landlord
          </button>
        </section>

        {/* FILTERS */}
        <section className="rounded-xl border border-[#E6E3D9] bg-white p-3">
          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#879187]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or phone..."
                className="w-full rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] py-2.5 pl-9 pr-3 text-xs text-[#344239] outline-none transition placeholder:text-[#9AA39A] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#A8BDA5]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto] lg:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] px-3 py-2.5 text-xs font-medium text-[#526056] outline-none focus:border-[#527C61]"
              >
                <option value="all">All Roles</option>
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] px-3 py-2.5 text-xs font-medium text-[#526056] outline-none focus:border-[#527C61]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="col-span-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#527C61] transition hover:bg-[#EAF0E8] sm:col-span-1"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-[#879187]">
            <span>
              Showing{" "}
              <strong className="text-[#344239]">
                {filteredUsers.length}
              </strong>{" "}
              of{" "}
              <strong className="text-[#344239]">{users.length}</strong> users
            </span>

            {hasFilters && (
              <span className="font-medium text-[#527C61]">
                Filters applied
              </span>
            )}
          </div>
        </section>

        {/* DESKTOP TABLE */}
        <section className="hidden overflow-hidden rounded-xl border border-[#E6E3D9] bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-[#E6E3D9] bg-[#F7F8F5]">
                  {["User", "Contact", "Role", "Status", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#68756A] ${
                          heading === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0F1EC]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const isActive = user.isActive !== false;

                    return (
                      <tr
                        key={user._id}
                        className="transition hover:bg-[#FAFBF8]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-xs font-bold text-[#244B3C]">
                              {getInitials(user.name)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-[#344239]">
                                {user.name}
                              </p>
                              <p className="text-[10px] text-[#9AA39A]">
                                ID: {user._id?.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p className="max-w-[230px] truncate text-xs font-medium text-[#526056]">
                            {user.email}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#9AA39A]">
                            {user.phone || "No phone number"}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ${getRoleStyle(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              isActive
                                ? "bg-[#EAF0E8] text-[#244B3C]"
                                : "bg-[#F8EFEC] text-[#A64B3C]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? "bg-[#527C61]" : "bg-[#C46A5A]"
                              }`}
                            />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            {user.role === "landlord" && (
                              <>
                                <button
                                  onClick={() => openEditModal(user)}
                                  className="inline-flex items-center gap-1 rounded-md border border-[#DCE7DA] bg-[#F7F8F5] px-2.5 py-1.5 text-[10px] font-semibold text-[#244B3C] transition hover:bg-[#EAF0E8]"
                                >
                                  <Pencil size={12} />
                                  Edit
                                </button>

                                <button
                                  onClick={() => openPasswordModal(user)}
                                  className="inline-flex items-center gap-1 rounded-md border border-[#E6E3D9] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#68756A] transition hover:bg-[#F7F8F5]"
                                >
                                  <KeyRound size={12} />
                                  Password
                                </button>

                                {isActive && (
                                  <button
                                    onClick={() => handleDeactivate(user)}
                                    className="inline-flex items-center gap-1 rounded-md border border-[#EBD9D3] bg-[#FBF3F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#A64B3C] transition hover:bg-[#F8EDEA]"
                                  >
                                    <UserX size={12} />
                                    Deactivate
                                  </button>
                                )}
                              </>
                            )}

                            {user.role === "admin" && (
                              <span className="px-2 py-1.5 text-[10px] text-[#9AA39A]">
                                No actions
                              </span>
                            )}

                            {!isActive && user.role !== "admin" && (
                              <span className="px-2 py-1.5 text-[10px] text-[#A64B3C]">
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
                    <td colSpan="5" className="px-4 py-10 text-center">
                      <UsersIcon
                        size={28}
                        className="mx-auto text-[#A8BDA5]"
                      />
                      <h3 className="mt-2 text-sm font-bold text-[#344239]">
                        No users found
                      </h3>
                      <p className="mt-1 text-xs text-[#879187]">
                        Try changing your search or filter options.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* MOBILE CARDS */}
        <section className="space-y-2 md:hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isActive = user.isActive !== false;

              return (
                <div
                  key={user._id}
                  className="rounded-xl border border-[#E6E3D9] bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-xs font-bold text-[#244B3C]">
                        {getInitials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-xs font-bold text-[#344239]">
                          {user.name}
                        </h3>
                        <p className="truncate text-[10px] text-[#879187]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold capitalize ring-1 ${getRoleStyle(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-[#F7F8F5] p-2.5">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#879187]">
                        Phone
                      </p>
                      <p className="mt-0.5 truncate text-xs font-medium text-[#526056]">
                        {user.phone || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#879187]">
                        Status
                      </p>
                      <span
                        className={`mt-0.5 inline-flex items-center gap-1 text-xs font-semibold ${
                          isActive ? "text-[#527C61]" : "text-[#A64B3C]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? "bg-[#527C61]" : "bg-[#C46A5A]"
                          }`}
                        />
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {user.role === "landlord" && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#DCE7DA] bg-[#F7F8F5] py-2 text-[10px] font-semibold text-[#244B3C] hover:bg-[#EAF0E8]"
                      >
                        <Pencil size={12} />
                        Edit Details
                      </button>

                      <button
                        onClick={() => openPasswordModal(user)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3D9] bg-white py-2 text-[10px] font-semibold text-[#68756A] hover:bg-[#F7F8F5]"
                      >
                        <KeyRound size={12} />
                        Update Password
                      </button>

                      {isActive && (
                        <button
                          onClick={() => handleDeactivate(user)}
                          className="col-span-2 rounded-lg border border-[#EBD9D3] bg-[#FBF3F0] py-2 text-[10px] font-semibold text-[#A64B3C] hover:bg-[#F8EDEA]"
                        >
                          Deactivate Landlord
                        </button>
                      )}

                      {!isActive && (
                        <p className="col-span-2 py-1 text-center text-[10px] font-semibold text-[#A64B3C]">
                          This landlord account is deactivated
                        </p>
                      )}
                    </div>
                  )}

                  {user.role === "admin" && (
                    <p className="mt-2 text-center text-[10px] text-[#879187]">
                      Administrator account
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-[#E6E3D9] bg-white px-4 py-10 text-center">
              <UsersIcon size={28} className="mx-auto text-[#A8BDA5]" />
              <h3 className="mt-2 text-sm font-bold text-[#344239]">
                No users found
              </h3>
              <p className="mt-1 text-xs text-[#879187]">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* LANDLORD MODALS */}
      {modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17251D]/50 p-3 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#E6E3D9] px-4 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#527C61]">
                  Admin / Landlord Management
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#242B26]">
                  {modalType === "create" && "Create Landlord"}
                  {modalType === "edit" && "Update Landlord Details"}
                  {modalType === "password" && "Update Landlord Password"}
                </h2>

                <p className="mt-0.5 text-xs text-[#68756A]">
                  {modalType === "create" &&
                    "Enter details to create a landlord account."}

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
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F1EC] text-[#68756A] transition hover:bg-[#E6E9E1] disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={16} />
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
              className="space-y-3 p-4"
            >
              {(modalType === "create" || modalType === "edit") && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#526056]">
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
                      className="w-full rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] px-3 py-2.5 text-xs text-[#344239] outline-none transition placeholder:text-[#9AA39A] focus:border-[#527C61] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#526056]">
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
                      className="w-full rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] px-3 py-2.5 text-xs text-[#344239] outline-none transition placeholder:text-[#9AA39A] focus:border-[#527C61] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#526056]">
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
                      className="w-full rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] px-3 py-2.5 text-xs text-[#344239] outline-none transition placeholder:text-[#9AA39A] focus:border-[#527C61] focus:bg-white"
                    />
                  </div>
                </>
              )}

              {(modalType === "create" || modalType === "password") && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#526056]">
                    {modalType === "create"
                      ? "Initial Password"
                      : "New Password"}
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      modalType === "create"
                        ? "Enter initial password"
                        : "Enter new password"
                    }
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] px-3 py-2.5 text-xs text-[#344239] outline-none transition placeholder:text-[#9AA39A] focus:border-[#527C61] focus:bg-white"
                  />

                  <p className="mt-1 text-[10px] text-[#879187]">
                    Password must contain at least 6 characters.
                  </p>
                </div>
              )}

              {modalType === "create" && (
                <div className="flex items-center gap-2 rounded-lg border border-[#DCE7DA] bg-[#F7F8F5] p-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
                    <Building2 size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#244B3C]">
                      Landlord Account
                    </p>
                    <p className="text-[10px] text-[#68756A]">
                      Role will automatically be set to Landlord.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-col-reverse gap-2 border-t border-[#E6E3D9] pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-[#E6E3D9] px-4 py-2.5 text-xs font-semibold text-[#68756A] transition hover:bg-[#F7F8F5] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#244B3C] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
