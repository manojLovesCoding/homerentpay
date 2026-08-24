import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const AssignedTenants = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedTenants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/property/assigned-tenants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties(res.data.properties || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTenants();
  }, []);

  /* ============================================================
     LOADING SKELETON
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header Skeleton */}
          <div className="mb-8 h-48 animate-pulse rounded-3xl bg-slate-200" />

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div className="h-48 animate-pulse bg-slate-200" />

                <div className="space-y-4 p-6">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />

                  <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                </div>
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
            PAGE HEADER
        ====================================================== */}

        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
          {/* Decorative backgrounds */}

          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-950/20 blur-3xl" />

          <div className="relative">
            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Rental Management
            </div>

            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  Assigned Tenants
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base">
                  Manage tenants currently living in your rental properties and
                  keep track of their rental details.
                </p>
              </div>

              {/* Total */}

              <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
                  👥
                </div>

                <div>
                  <p className="text-xs text-blue-100/70">Active Rentals</p>

                  <p className="text-xl font-bold text-white">
                    {properties.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {properties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
              🏠
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              No tenants assigned yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Properties with assigned tenants will appear here. Once you assign
              a tenant to a property, their rental information will be displayed
              on this page.
            </p>
          </div>
        ) : (
          /* ===================================================
             PROPERTY GRID
          ==================================================== */

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {properties.map((property) => {
              const tenant = property.tenant;

              return (
                <div
                  key={property._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
                >
                  {/* =================================================
                      PROPERTY IMAGE
                  ================================================== */}

                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                    {property.image ? (
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl">🏠</div>

                          <p className="mt-2 text-sm font-medium text-blue-400">
                            Property Image
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay */}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Status */}

                    <div className="absolute right-4 top-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-emerald-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Rented
                      </span>
                    </div>

                    {/* Property title over image */}

                    <div className="absolute bottom-4 left-5 right-5">
                      <h2 className="truncate text-xl font-bold text-white">
                        {property.title}
                      </h2>

                      <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                        📍 {property.city}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      PROPERTY CONTENT
                  ================================================== */}

                  <div className="p-5 sm:p-6">
                    {/* Address */}

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        📍
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Property Address
                        </p>

                        <p className="mt-1 text-sm font-medium leading-5 text-slate-700">
                          {property.address}
                        </p>
                      </div>
                    </div>

                    {/* Rent */}

                    <div className="mt-5 rounded-2xl bg-blue-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            ₹
                          </div>

                          <div>
                            <p className="text-xs text-blue-400">
                              Monthly Rent
                            </p>

                            <p className="text-xl font-bold text-blue-700">
                              ₹
                              {Number(property.rent || 0).toLocaleString(
                                "en-IN",
                              )}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-medium text-blue-400">
                          / month
                        </span>
                      </div>
                    </div>

                    {/* Divider */}

                    <div className="my-6 border-t border-slate-100" />

                    {/* =================================================
                        TENANT SECTION
                    ================================================== */}

                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900">
                            Tenant Details
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            Current occupant
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                          Active
                        </span>
                      </div>

                      {tenant ? (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-center gap-4">
                            {/* Avatar */}

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
                              {tenant.name?.charAt(0)?.toUpperCase() || "T"}
                            </div>

                            {/* Tenant info */}

                            <div className="min-w-0 flex-1">
                              <h4 className="truncate font-bold text-slate-900">
                                {tenant.name || "Unknown Tenant"}
                              </h4>

                              <p className="mt-1 truncate text-sm text-slate-500">
                                {tenant.email || "No email available"}
                              </p>
                            </div>

                            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:flex">
                              ✓
                            </div>
                          </div>

                          {/* Contact details */}

                          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="rounded-xl bg-white px-3 py-2.5">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Phone
                              </p>

                              <p className="mt-1 truncate text-sm font-medium text-slate-700">
                                {tenant.phone || "Not provided"}
                              </p>
                            </div>

                            <div className="rounded-xl bg-white px-3 py-2.5">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Status
                              </p>

                              <p className="mt-1 text-sm font-semibold text-emerald-600">
                                ● Occupied
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                          Tenant information unavailable
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        RENT DUE
                    ================================================== */}

                    {property.dueDate && (
                      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                          📅
                        </div>

                        <div>
                          <p className="text-xs font-medium text-amber-500">
                            Rent Due Date
                          </p>

                          <p className="mt-0.5 text-sm font-bold text-amber-800">
                            Every {property.dueDate}th of the month
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTenants;
