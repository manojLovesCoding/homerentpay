
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  Pencil,
  KeyRound,
  Ban,
  Mail,
  Phone,
  X,
  CheckCircle2,
  Building2,
} from "lucide-react";

const TenantList = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deactivatingId, setDeactivatingId] = useState(null);

  const fetchTenants = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/auth/tenants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTenants(res.data.tenants || []);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to load tenants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  /* DEACTIVATE TENANT */

  const handleDeactivate = async (id) => {
    const confirmToast = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#242B26]">
              Deactivate this tenant?
            </p>
            <p className="mt-0.5 text-xs text-[#68756A]">
              The tenant account will become inactive.
            </p>
          </div>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDeactivate(id);
            }}
            className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Confirm
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg border border-[#E6E3D9] px-3 py-2 text-xs font-semibold text-[#526056] hover:bg-[#F7F4EA]"
          >
            Cancel
          </button>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );

    return confirmToast;
  };

  const confirmDeactivate = async (id) => {
    try {
      setDeactivatingId(id);

      const token = localStorage.getItem("token");

      await api.patch(
        `/auth/tenant/${id}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTenants((prev) =>
        prev.map((tenant) =>
          tenant._id === id
            ? { ...tenant, isActive: false }
            : tenant
        )
      );

      toast.success("Tenant deactivated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Deactivate failed"
      );
    } finally {
      setDeactivatingId(null);
    }
  };

  /* FILTER TENANTS */

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const searchText = search.toLowerCase().trim();

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

  const activeCount = tenants.filter(
    (tenant) => tenant.isActive
  ).length;

  const inactiveCount = tenants.length - activeCount;

  /* LOADING */

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-xl bg-[#E8ECE5]" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl bg-[#E8ECE5]"
            />
          ))}
        </div>

        <div className="h-12 animate-pulse rounded-xl bg-[#E8ECE5]" />

        <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-14 animate-pulse border-b border-[#EEECE4] bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#242B26]">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#244B3C]">
            <Users size={20} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#242B26]">
              Tenant Management
            </h1>
            <p className="mt-0.5 text-xs text-[#68756A]">
              Manage tenant accounts and access.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchTenants}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3D9] bg-white px-3 py-2 text-xs font-semibold text-[#244B3C] transition hover:bg-[#F7F4EA] disabled:opacity-50"
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            onClick={() => navigate("/landlord/add-tenant")}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#244B3C] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#193A2E]"
          >
            <UserPlus size={15} />
            Add Tenant
          </button>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-[#E6E3D9] bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#68756A]">
              Total Tenants
            </p>
            <Users size={15} className="text-[#527C61]" />
          </div>
          <p className="mt-1 text-xl font-bold text-[#244B3C]">
            {tenants.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E6E3D9] bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#68756A]">
              Active
            </p>
            <CheckCircle2 size={15} className="text-[#527C61]" />
          </div>
          <p className="mt-1 text-xl font-bold text-[#527C61]">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#E6E3D9] bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#68756A]">
              Inactive
            </p>
            <Ban size={15} className="text-[#B66A5C]" />
          </div>
          <p className="mt-1 text-xl font-bold text-[#B66A5C]">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER */}

      <div className="rounded-xl border border-[#E6E3D9] bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928A]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone..."
              className="w-full rounded-lg border border-[#E6E3D9] bg-[#FAFAF7] py-2 pl-9 pr-3 text-xs text-[#242B26] outline-none transition placeholder:text-[#A0A79F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E6E3D9] bg-[#FAFAF7] px-3 py-2 text-xs font-medium text-[#526056] outline-none focus:border-[#527C61] sm:w-40"
          >
            <option value="all">All Tenants</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-[#89928A]">
            Showing{" "}
            <span className="font-semibold text-[#244B3C]">
              {filteredTenants.length}
            </span>{" "}
            of {tenants.length} tenants
          </p>

          {(search || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#527C61] hover:text-[#244B3C]"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* EMPTY STATE */}

      {filteredTenants.length === 0 ? (
        <div className="rounded-xl border border-[#E6E3D9] bg-white px-4 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#527C61]">
            <Users size={23} />
          </div>

          <h2 className="mt-3 text-base font-bold text-[#242B26]">
            No tenants found
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-xs text-[#68756A]">
            {search || statusFilter !== "all"
              ? "Try changing your search or status filter."
              : "You don't have any tenants yet. Add your first tenant to get started."}
          </p>

          {!search && statusFilter === "all" && (
            <button
              onClick={() => navigate("/landlord/add-tenant")}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#244B3C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#193A2E]"
            >
              <UserPlus size={14} />
              Add First Tenant
            </button>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}

          <div className="hidden overflow-hidden rounded-xl border border-[#E6E3D9] bg-white md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#F7F4EA]">
                  <tr className="text-[10px] font-bold uppercase tracking-wide text-[#68756A]">
                    <th className="px-4 py-3">Tenant</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EEECE4]">
                  {filteredTenants.map((tenant) => (
                    <tr
                      key={tenant._id}
                      className="transition hover:bg-[#FAFAF6]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-xs font-bold text-[#244B3C]">
                            {tenant.name?.charAt(0)?.toUpperCase() || "T"}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[160px] truncate text-xs font-semibold text-[#242B26]">
                              {tenant.name || "Unnamed Tenant"}
                            </p>
                            <p className="text-[10px] text-[#89928A]">
                              Tenant
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="max-w-[190px] truncate text-xs text-[#526056]">
                          {tenant.email || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs text-[#526056]">
                          {tenant.phone || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            tenant.isActive
                              ? "bg-[#EAF0E8] text-[#527C61]"
                              : "bg-[#FCEDEA] text-[#B66A5C]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              tenant.isActive
                                ? "bg-[#527C61]"
                                : "bg-[#B66A5C]"
                            }`}
                          />
                          {tenant.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() =>
                              navigate(`/landlord/tenant/edit/${tenant._id}`)
                            }
                            className="inline-flex items-center gap-1 rounded-md bg-[#F7F4EA] px-2.5 py-1.5 text-[10px] font-semibold text-[#8B642F] transition hover:bg-[#F0E8D5]"
                          >
                            <Pencil size={11} />
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              navigate(
                                `/landlord/tenant/password/${tenant._id}`
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-md bg-[#EAF0E8] px-2.5 py-1.5 text-[10px] font-semibold text-[#244B3C] transition hover:bg-[#DCE8DA]"
                          >
                            <KeyRound size={11} />
                            Password
                          </button>

                          {tenant.isActive && (
                            <button
                              onClick={() => handleDeactivate(tenant._id)}
                              disabled={deactivatingId === tenant._id}
                              className="inline-flex items-center gap-1 rounded-md bg-[#FCEDEA] px-2.5 py-1.5 text-[10px] font-semibold text-[#B66A5C] transition hover:bg-[#F8DFDA] disabled:opacity-50"
                            >
                              <Ban size={11} />
                              {deactivatingId === tenant._id
                                ? "Please wait"
                                : "Deactivate"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE TENANT CARDS */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant._id}
                className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white"
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF0E8] text-sm font-bold text-[#244B3C]">
                    {tenant.name?.charAt(0)?.toUpperCase() || "T"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-bold text-[#242B26]">
                      {tenant.name || "Unnamed Tenant"}
                    </h2>
                    <p className="truncate text-[11px] text-[#68756A]">
                      {tenant.email || "No email"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                      tenant.isActive
                        ? "bg-[#EAF0E8] text-[#527C61]"
                        : "bg-[#FCEDEA] text-[#B66A5C]"
                    }`}
                  >
                    {tenant.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-y border-[#EEECE4] bg-[#FAFAF7] p-3">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="shrink-0 text-[#527C61]" />
                    <span className="truncate text-[11px] text-[#526056]">
                      {tenant.phone || "Not provided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={13} className="shrink-0 text-[#527C61]" />
                    <span className="truncate text-[11px] text-[#526056]">
                      {tenant.email || "No email"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3">
                  <button
                    onClick={() =>
                      navigate(`/landlord/tenant/edit/${tenant._id}`)
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F7F4EA] px-2 py-2 text-[11px] font-semibold text-[#8B642F] hover:bg-[#F0E8D5]"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/landlord/tenant/password/${tenant._id}`)
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EAF0E8] px-2 py-2 text-[11px] font-semibold text-[#244B3C] hover:bg-[#DCE8DA]"
                  >
                    <KeyRound size={13} />
                    Password
                  </button>

                  {tenant.isActive && (
                    <button
                      onClick={() => handleDeactivate(tenant._id)}
                      disabled={deactivatingId === tenant._id}
                      className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FCEDEA] px-2 py-2 text-[11px] font-semibold text-[#B66A5C] hover:bg-[#F8DFDA] disabled:opacity-50"
                    >
                      <Ban size={13} />
                      {deactivatingId === tenant._id
                        ? "Please wait..."
                        : "Deactivate Tenant"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TenantList;
