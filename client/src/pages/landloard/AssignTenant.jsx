import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AssignTenant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dueDate, setDueDate] = useState("");

  /* ============================================================
     FETCH TENANTS
  ============================================================ */

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setFetching(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/auth/tenants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const activeTenants =
        res.data.tenants?.filter((tenant) => tenant.isActive) || [];

      setTenants(activeTenants);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  /* ============================================================
     ASSIGN TENANT
  ============================================================ */

  const handleAssign = async () => {
    if (!tenantId) {
      return alert("Please select a tenant");
    }

    if (!dueDate) {
      return alert("Please select a rent due date");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.put(
        `/property/${id}/assign-tenant`,
        {
          tenantId,
          dueDate: Number(dueDate),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Tenant assigned successfully");

      navigate("/landlord/properties");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign tenant");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     SELECTED TENANT
  ============================================================ */

  const selectedTenant = tenants.find((tenant) => tenant._id === tenantId);

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 h-44 animate-pulse rounded-3xl bg-slate-200" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200 lg:col-span-2" />

            <div className="h-80 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
          {/* Decorative circles */}

          <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-950/20 blur-3xl" />

          <div className="relative">
            {/* Back button */}

            <button
              type="button"
              onClick={() => navigate("/landlord/properties")}
              className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              ← Back to Properties
            </button>

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Tenant Assignment
            </div>

            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Assign Tenant
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base">
              Choose an active tenant and set their monthly rent due date for
              this property.
            </p>
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* =================================================
              MAIN FORM
          ================================================== */}

          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              {/* Section heading */}

              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  👤
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Tenant Details
                  </h2>

                  <p className="text-sm text-slate-500">
                    Select the tenant who will occupy this property.
                  </p>
                </div>
              </div>

              {/* =================================================
                  TENANT COUNT
              ================================================== */}

              <div className="mb-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                    👥
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Available Tenants</p>

                    <p className="font-bold text-slate-800">
                      {tenants.length} Active
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  Active
                </span>
              </div>

              {/* =================================================
                  TENANT SELECT
              ================================================== */}

              <div>
                <label
                  htmlFor="tenant"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Select Tenant
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-blue-50">
                    👤
                  </div>

                  <select
                    id="tenant"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    disabled={loading || tenants.length === 0}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-16 pr-12 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {tenants.length === 0
                        ? "No active tenants available"
                        : "Choose a tenant..."}
                    </option>

                    {tenants.map((tenant) => (
                      <option key={tenant._id} value={tenant._id}>
                        {tenant.name} — {tenant.email}
                      </option>
                    ))}
                  </select>

                  {/* Arrow */}

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* =================================================
                  SELECTED TENANT
              ================================================== */}

              {selectedTenant && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/50">
                  <div className="flex items-center gap-4 p-4">
                    {/* Avatar */}

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
                      {selectedTenant.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* Info */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {selectedTenant.name}
                        </h3>

                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          Active
                        </span>
                      </div>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {selectedTenant.email}
                      </p>

                      {selectedTenant.phone && (
                        <p className="mt-1 text-xs text-slate-400">
                          📞 {selectedTenant.phone}
                        </p>
                      )}
                    </div>

                    {/* Check */}

                    <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:flex">
                      ✓
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}

              <div className="my-8 border-t border-slate-100" />

              {/* =================================================
                  DUE DATE
              ================================================== */}

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Monthly Rent Due Date
                  </label>

                  <p className="mt-1 text-xs text-slate-400">
                    Choose the day of every month when rent should be due.
                  </p>
                </div>

                {/* Due date grid */}

                <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
                  {Array.from({ length: 31 }, (_, index) => index + 1).map(
                    (day) => {
                      const selected = Number(dueDate) === day;

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setDueDate(String(day))}
                          disabled={loading}
                          className={`flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {day}
                        </button>
                      );
                    },
                  )}
                </div>

                {/* Selected date */}

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                    📅
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Selected Due Date</p>

                    <p className="font-semibold text-slate-800">
                      {dueDate
                        ? `Every ${dueDate}${
                            ["1", "21", "31"].includes(dueDate)
                              ? "st"
                              : ["2", "22"].includes(dueDate)
                                ? "nd"
                                : ["3", "23"].includes(dueDate)
                                  ? "rd"
                                  : "th"
                          } of every month`
                        : "No date selected"}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  MOBILE ACTIONS
              ================================================== */}

              <div className="mt-8 flex flex-col gap-3 sm:hidden">
                <button
                  type="button"
                  onClick={() => navigate("/landlord/properties")}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={loading || !tenantId || !dueDate}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      Assign Tenant
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================== */}

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Assignment Preview */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Assignment Preview
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl backdrop-blur">
                    🏠
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      Property #{id.slice(-6)}
                    </p>

                    <p className="text-xs text-blue-100/70">
                      Rental Assignment
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Tenant */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    👤
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Tenant</p>

                    <p className="truncate font-semibold text-slate-800">
                      {selectedTenant?.name || "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="my-5 border-t border-slate-100" />

                {/* Due date */}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    📅
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Rent Due</p>

                    <p className="font-semibold text-slate-800">
                      {dueDate
                        ? `Day ${dueDate} of every month`
                        : "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="my-5 border-t border-slate-100" />

                {/* Status */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Assignment Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      tenantId && dueDate
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {tenantId && dueDate ? "Ready" : "Incomplete"}
                  </span>
                </div>
              </div>
            </div>

            {/* Important information */}

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  💡
                </div>

                <div>
                  <h3 className="font-semibold text-blue-900">
                    Assignment Information
                  </h3>

                  <ul className="mt-3 space-y-2.5 text-sm text-blue-900/70">
                    <li className="flex gap-2">
                      <span className="text-blue-500">✓</span>
                      Only active tenants can be assigned.
                    </li>

                    <li className="flex gap-2">
                      <span className="text-blue-500">✓</span>
                      Rent will be due on the selected day.
                    </li>

                    <li className="flex gap-2">
                      <span className="text-blue-500">✓</span>
                      Make sure the tenant details are correct.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            DESKTOP ACTION BAR
        ====================================================== */}

        <div className="mt-6 hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:block">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800">
                Ready to assign this property?
              </p>

              <p className="mt-1 text-xs text-slate-400">
                The tenant will be associated with this property after
                confirmation.
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => navigate("/landlord/properties")}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAssign}
                disabled={loading || !tenantId || !dueDate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Assigning...
                  </>
                ) : (
                  <>
                    Assign Tenant
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTenant;
