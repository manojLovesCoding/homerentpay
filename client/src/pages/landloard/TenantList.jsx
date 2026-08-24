import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

const TenantList = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/auth/tenants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTenants(res.data.tenants || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  /* ============================================================
     DEACTIVATE TENANT
  ============================================================ */

  const handleDeactivate = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this tenant?",
    );

    if (!confirmDeactivate) return;

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/auth/tenant/${id}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTenants((prev) =>
        prev.map((tenant) =>
          tenant._id === id
            ? {
                ...tenant,
                isActive: false,
              }
            : tenant,
        ),
      );

      alert("Tenant deactivated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Deactivate failed");
    }
  };

  /* ============================================================
     FILTER TENANTS
  ============================================================ */

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        tenant.name?.toLowerCase().includes(searchText) ||
        tenant.email?.toLowerCase().includes(searchText) ||
        tenant.phone?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && tenant.isActive) ||
        (statusFilter === "inactive" && !tenant.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [tenants, search, statusFilter]);

  const activeCount = tenants.filter((tenant) => tenant.isActive).length;

  const inactiveCount = tenants.length - activeCount;

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header skeleton */}
          <div className="mb-8 h-48 animate-pulse rounded-3xl bg-slate-200" />

          {/* Filter skeleton */}
          <div className="mb-6 h-20 animate-pulse rounded-3xl bg-slate-200" />

          {/* Table skeleton */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-5 border-b border-slate-100 p-5"
              >
                <div className="h-11 w-11 rounded-full bg-slate-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                </div>

                <div className="h-8 w-20 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
          {/* Decorations */}

          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-950/20 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                {/* Badge */}

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Tenant Management
                </div>

                <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                  Tenant Management
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base">
                  Manage your tenants, view their details and control account
                  access from one place.
                </p>
              </div>

              {/* Add button */}

              <button
                onClick={() => navigate("/landlord/add-tenant")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 sm:w-auto"
              >
                <span className="text-lg">+</span>
                Add Tenant
              </button>
            </div>

            {/* Stats */}

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* Total */}

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-blue-100/70">Total Tenants</p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {tenants.length}
                </p>
              </div>

              {/* Active */}

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-blue-100/70">Active</p>

                <p className="mt-1 text-2xl font-bold text-emerald-300">
                  {activeCount}
                </p>
              </div>

              {/* Inactive */}

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur sm:col-span-1">
                <p className="text-xs text-blue-100/70">Inactive</p>

                <p className="mt-1 text-2xl font-bold text-rose-300">
                  {inactiveCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH + FILTER
        ====================================================== */}

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Status filter */}

            <div className="relative md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="all">All Tenants</option>

                <option value="active">Active Only</option>

                <option value="inactive">Inactive Only</option>
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </span>
            </div>
          </div>

          {/* Results count */}

          <div className="mt-3 flex items-center justify-between text-xs">
            <p className="text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredTenants.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {tenants.length}
              </span>{" "}
              tenants
            </p>

            {(search || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredTenants.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
              👥
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              No tenants found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search || statusFilter !== "all"
                ? "Try changing your search or filter to find a tenant."
                : "You don't have any tenants yet. Add your first tenant to get started."}
            </p>

            {!search && statusFilter === "all" && (
              <button
                onClick={() => navigate("/landlord/add-tenant")}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                + Add Your First Tenant
              </button>
            )}
          </div>
        ) : (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
              {/* Table header */}

              <div className="grid grid-cols-[1.3fr_1.5fr_1fr_0.8fr_1.5fr] gap-4 bg-slate-50 px-6 py-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tenant
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Phone
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </div>
              </div>

              {/* Table rows */}

              {filteredTenants.map((tenant) => (
                <div
                  key={tenant._id}
                  className="grid grid-cols-[1.3fr_1.5fr_1fr_0.8fr_1.5fr] items-center gap-4 border-t border-slate-100 px-6 py-5 transition hover:bg-blue-50/40"
                >
                  {/* Tenant */}

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/20">
                      {tenant.name?.charAt(0)?.toUpperCase() || "T"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-800">
                        {tenant.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">Tenant</p>
                    </div>
                  </div>

                  {/* Email */}

                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-600">
                      {tenant.email}
                    </p>
                  </div>

                  {/* Phone */}

                  <div>
                    <p className="text-sm text-slate-600">
                      {tenant.phone || "—"}
                    </p>
                  </div>

                  {/* Status */}

                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                        tenant.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          tenant.isActive ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />

                      {tenant.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Actions */}

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        navigate(`/landlord/tenant/edit/${tenant._id}`)
                      }
                      className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/landlord/tenant/password/${tenant._id}`)
                      }
                      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      Password
                    </button>

                    {tenant.isActive && (
                      <button
                        onClick={() => handleDeactivate(tenant._id)}
                        className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredTenants.map((tenant) => (
                <div
                  key={tenant._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  {/* Card header */}

                  <div className="flex items-center gap-4 p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
                      {tenant.name?.charAt(0)?.toUpperCase() || "T"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-bold text-slate-900">
                        {tenant.name}
                      </h2>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {tenant.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        tenant.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {tenant.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  {/* Details */}

                  <div className="grid grid-cols-2 gap-3 border-y border-slate-100 bg-slate-50 p-4">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Phone
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-slate-700">
                        {tenant.phone || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Account
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          tenant.isActive ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {tenant.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="grid grid-cols-2 gap-2 p-4">
                    <button
                      onClick={() =>
                        navigate(`/landlord/tenant/edit/${tenant._id}`)
                      }
                      className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/landlord/tenant/password/${tenant._id}`)
                      }
                      className="rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      🔑 Password
                    </button>

                    {tenant.isActive && (
                      <button
                        onClick={() => handleDeactivate(tenant._id)}
                        className="col-span-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        🚫 Deactivate Tenant
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TenantList;
