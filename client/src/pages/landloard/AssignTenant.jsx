
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Users,
  UserRound,
  CalendarDays,
  House,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AssignTenant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dueDate, setDueDate] = useState("");

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
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to load tenants"
      );
    } finally {
      setFetching(false);
    }
  };

  const handleAssign = async () => {
    if (!tenantId) {
      return toast.error("Please select a tenant");
    }

    if (!dueDate) {
      return toast.error("Please select a rent due date");
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
        }
      );

      toast.success("Tenant assigned successfully!");
      navigate("/landlord/properties");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to assign tenant"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedTenant = tenants.find(
    (tenant) => tenant._id === tenantId
  );

  const getOrdinal = (day) => {
    if (["11", "12", "13"].includes(day)) return "th";

    switch (day.slice(-1)) {
      case "1":
        return "st";
      case "2":
        return "nd";
      case "3":
        return "rd";
      default:
        return "th";
    }
  };

  const isReady = Boolean(tenantId && dueDate);

  if (fetching) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-5">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-24 animate-pulse rounded-2xl bg-[#E8EDE7]" />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="h-80 animate-pulse rounded-2xl bg-[#E8EDE7] lg:col-span-2" />
            <div className="h-64 animate-pulse rounded-2xl bg-[#E8EDE7]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-5">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-4 rounded-2xl bg-[#244B3C] px-4 py-4 text-white shadow-sm sm:px-5">
          <button
            type="button"
            onClick={() => navigate("/landlord/properties")}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#DCE8DE] transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to Properties
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#C7D9C8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D6A45D]" />
                Tenant Assignment
              </div>

              <h1 className="text-2xl font-bold">
                Assign Tenant
              </h1>

              <p className="mt-1 text-xs text-[#DCE8DE]">
                Select an active tenant and set the monthly rent due date.
              </p>
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-white/10 sm:flex">
              <House size={25} />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* MAIN FORM */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[#E6E3D9] bg-white p-4 shadow-sm sm:p-5">

              {/* SECTION TITLE */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0E9] text-[#244B3C]">
                  <UserRound size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#242B26]">
                    Tenant Details
                  </h2>
                  <p className="text-xs text-[#68756A]">
                    Choose who will occupy this property.
                  </p>
                </div>
              </div>

              {/* TENANT COUNT */}
              <div className="mb-4 flex items-center justify-between rounded-xl bg-[#F7F8F5] px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E3EDE2] text-[#244B3C]">
                    <Users size={17} />
                  </div>

                  <div>
                    <p className="text-[11px] text-[#68756A]">
                      Available Tenants
                    </p>
                    <p className="text-sm font-bold text-[#242B26]">
                      {tenants.length} Active
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-[#E7F1E6] px-2.5 py-1 text-[10px] font-bold text-[#527C61]">
                  Active
                </span>
              </div>

              {/* TENANT SELECT */}
              <div>
                <label
                  htmlFor="tenant"
                  className="mb-1.5 block text-xs font-semibold text-[#526056]"
                >
                  Select Tenant
                </label>

                <select
                  id="tenant"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  disabled={loading || tenants.length === 0}
                  className="w-full rounded-xl border border-[#E6E3D9] bg-[#FAFBF9] px-3 py-3 text-sm text-[#242B26] outline-none transition focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:cursor-not-allowed disabled:opacity-60"
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
              </div>

              {/* SELECTED TENANT */}
              {selectedTenant && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#DCE8DA] bg-[#F5F8F3] p-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#244B3C] text-base font-bold text-white">
                    {selectedTenant.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-[#242B26]">
                        {selectedTenant.name}
                      </p>
                      <span className="rounded-full bg-[#E3EDE2] px-2 py-0.5 text-[9px] font-bold text-[#527C61]">
                        ACTIVE
                      </span>
                    </div>

                    <p className="truncate text-xs text-[#68756A]">
                      {selectedTenant.email}
                    </p>

                    {selectedTenant.phone && (
                      <p className="mt-0.5 text-[11px] text-[#68756A]">
                        {selectedTenant.phone}
                      </p>
                    )}
                  </div>

                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-[#527C61]"
                  />
                </div>
              )}

              {/* DIVIDER */}
              <div className="my-5 border-t border-[#EEEDE7]" />

              {/* DUE DATE */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5EFE2] text-[#9A7138]">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#242B26]">
                      Monthly Rent Due Date
                    </h3>
                    <p className="text-[11px] text-[#68756A]">
                      Select the day rent is due every month.
                    </p>
                  </div>
                </div>

                {/* DATE GRID */}
                <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-10">
                  {Array.from(
                    { length: 31 },
                    (_, index) => index + 1
                  ).map((day) => {
                    const selected = Number(dueDate) === day;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setDueDate(String(day))}
                        disabled={loading}
                        className={`flex h-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                          selected
                            ? "border-[#244B3C] bg-[#244B3C] text-white"
                            : "border-[#E6E3D9] bg-[#FAFBF9] text-[#526056] hover:border-[#527C61] hover:bg-[#EAF0E9]"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* SELECTED DATE */}
                <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[#F7F8F5] px-3 py-2.5">
                  <CalendarDays
                    size={18}
                    className="text-[#527C61]"
                  />

                  <div>
                    <p className="text-[10px] text-[#68756A]">
                      Selected Due Date
                    </p>
                    <p className="text-xs font-bold text-[#244B3C]">
                      {dueDate
                        ? `Every ${dueDate}${getOrdinal(dueDate)} of every month`
                        : "No date selected"}
                    </p>
                  </div>
                </div>
              </div>

              {/* MOBILE ACTIONS */}
              <div className="mt-5 flex flex-col gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => navigate("/landlord/properties")}
                  disabled={loading}
                  className="w-full rounded-xl border border-[#E6E3D9] px-4 py-2.5 text-sm font-semibold text-[#526056] hover:bg-[#F7F8F5] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={loading || !isReady}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#244B3C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Assigning..." : "Assign Tenant"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">

            {/* PREVIEW */}
            <div className="overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-sm">
              <div className="bg-[#244B3C] p-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#DCE8DE]">
                  Assignment Preview
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <House size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Property #{id?.slice(-6)}
                    </p>
                    <p className="text-[10px] text-[#DCE8DE]">
                      Rental Assignment
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF0E9] text-[#244B3C]">
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-[#68756A]">Tenant</p>
                    <p className="truncate text-xs font-bold text-[#242B26]">
                      {selectedTenant?.name || "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#EEEDE7]" />

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5EFE2] text-[#9A7138]">
                    <CalendarDays size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#68756A]">Rent Due</p>
                    <p className="text-xs font-bold text-[#242B26]">
                      {dueDate
                        ? `Day ${dueDate} every month`
                        : "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#EEEDE7]" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#68756A]">
                    Assignment Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      isReady
                        ? "bg-[#E7F1E6] text-[#527C61]"
                        : "bg-[#F5EFE2] text-[#9A7138]"
                    }`}
                  >
                    {isReady ? "Ready" : "Incomplete"}
                  </span>
                </div>
              </div>
            </div>

            {/* INFORMATION */}
            <div className="rounded-2xl border border-[#E6E3D9] bg-[#F0F4ED] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb size={18} className="text-[#9A7138]" />
                <h3 className="text-sm font-bold text-[#244B3C]">
                  Assignment Information
                </h3>
              </div>

              <ul className="space-y-2 text-[11px] text-[#526056]">
                <li className="flex gap-2">
                  <Check size={14} className="shrink-0 text-[#527C61]" />
                  Only active tenants can be assigned.
                </li>
                <li className="flex gap-2">
                  <Check size={14} className="shrink-0 text-[#527C61]" />
                  Rent will be due on the selected day.
                </li>
                <li className="flex gap-2">
                  <Check size={14} className="shrink-0 text-[#527C61]" />
                  Verify tenant details before assigning.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* DESKTOP ACTION BAR */}
        <div className="mt-4 hidden items-center justify-between gap-4 rounded-2xl border border-[#E6E3D9] bg-white px-4 py-3 shadow-sm sm:flex">
          <div>
            <p className="text-sm font-bold text-[#242B26]">
              Ready to assign this property?
            </p>
            <p className="text-[11px] text-[#68756A]">
              Confirm the tenant and monthly rent due date.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => navigate("/landlord/properties")}
              disabled={loading}
              className="rounded-xl border border-[#E6E3D9] px-4 py-2.5 text-xs font-semibold text-[#526056] transition hover:bg-[#F7F8F5] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAssign}
              disabled={loading || !isReady}
              className="inline-flex items-center gap-2 rounded-xl bg-[#244B3C] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign Tenant"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTenant;
