import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/property");
      setProperties(res.data.properties || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/property/${id}`);

      setProperties((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete property");
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-72 bg-slate-200 rounded mt-3" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="h-48 bg-slate-200 animate-pulse" />

                <div className="p-5 space-y-4">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-10 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- PAGE ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 shadow-xl shadow-blue-100">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-16 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute right-20 -bottom-20 w-40 h-40 bg-white/10 rounded-full" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl">
                  🏠
                </div>

                <span className="text-blue-100 text-sm font-medium">
                  Property Management
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Properties
              </h1>

              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                Manage and monitor all properties in your rental system.
              </p>
            </div>

            {/* Property Count */}
            <div className="self-start sm:self-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 text-white min-w-[130px]">
              <p className="text-xs text-blue-100">Total Properties</p>

              <p className="text-2xl font-bold mt-1">{properties.length}</p>
            </div>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">Total</p>

                <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
                  {properties.length}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                🏠
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">Available</p>

                <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                  {properties.filter((p) => p.status === "available").length}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                ✓
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">Rented</p>

                <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                  {properties.filter((p) => p.status !== "available").length}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                🔑
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">Avg. Rent</p>

                <p className="text-xl sm:text-2xl font-bold text-violet-600 mt-1">
                  ₹
                  {properties.length
                    ? Math.round(
                        properties.reduce(
                          (sum, p) => sum + Number(p.rent || 0),
                          0,
                        ) / properties.length,
                      )
                    : 0}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                ₹
              </div>
            </div>
          </div>
        </div>

        {/* ================= EMPTY STATE ================= */}

        {properties.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-16 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center text-4xl">
              🏠
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-5">
              No properties found
            </h2>

            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              There are currently no properties available in the system.
            </p>
          </div>
        ) : (
          <>
            {/* ================================================= */}
            {/* MOBILE / TABLET CARDS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:hidden gap-5">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                    {property.image ? (
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🏠
                      </div>
                    )}

                    {/* Status */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                          property.status === "available"
                            ? "bg-emerald-100/90 text-emerald-700"
                            : "bg-amber-100/90 text-amber-700"
                        }`}
                      >
                        {property.status || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800 line-clamp-1">
                          {property.title}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                          📍 {property.city}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-blue-600">
                          ₹{property.rent}
                        </p>

                        <p className="text-xs text-slate-400">/ month</p>
                      </div>
                    </div>

                    {/* Landlord */}
                    <div className="mt-5 p-3 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Landlord
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {property.landlord?.name?.charAt(0)?.toUpperCase() ||
                            "L"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-700 truncate">
                            {property.landlord?.name || "N/A"}
                          </p>

                          <p className="text-xs text-slate-400 truncate">
                            {property.landlord?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tenant */}
                    <div className="mt-3 p-3 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Tenant
                      </p>

                      {property.tenant ? (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                            {property.tenant.name?.charAt(0)?.toUpperCase() ||
                              "T"}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-700 truncate">
                              {property.tenant.name}
                            </p>

                            <p className="text-xs text-slate-400 truncate">
                              {property.tenant.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 mt-2">
                          No tenant assigned
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-5">
                      <button className="flex-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition">
                        View Details
                      </button>

                      <button
                        onClick={() => handleDelete(property._id)}
                        className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================================================= */}
            {/* DESKTOP TABLE */}
            {/* ================================================= */}

            <div className="hidden xl:block bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Property Directory
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    All registered rental properties
                  </p>
                </div>

                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                  {properties.length} Properties
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Property
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Landlord
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Tenant
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Rent
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {properties.map((property) => (
                      <tr
                        key={property._id}
                        className="group hover:bg-blue-50/40 transition"
                      >
                        {/* Property */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 shrink-0">
                              {property.image ? (
                                <img
                                  src={property.image}
                                  alt={property.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  🏠
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate max-w-[220px]">
                                {property.title}
                              </p>

                              <p className="text-sm text-slate-500 mt-1">
                                📍 {property.city}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Landlord */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {property.landlord?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "L"}
                            </div>

                            <div>
                              <p className="font-medium text-slate-700">
                                {property.landlord?.name || "N/A"}
                              </p>

                              <p className="text-xs text-slate-400">
                                {property.landlord?.email || ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tenant */}
                        <td className="px-6 py-5">
                          {property.tenant ? (
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                {property.tenant.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "T"}
                              </div>

                              <div>
                                <p className="font-medium text-slate-700">
                                  {property.tenant.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {property.tenant.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                              Not Assigned
                            </span>
                          )}
                        </td>

                        {/* Rent */}
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-800">
                            ₹{property.rent}
                          </p>

                          <p className="text-xs text-slate-400">monthly</p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              property.status === "available"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                property.status === "available"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />

                            {property.status || "Unknown"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition">
                              View
                            </button>

                            <button
                              onClick={() => handleDelete(property._id)}
                              className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
