import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const res = await api.get("/property");

      setProperties(res.data.properties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/property/${id}`);

      setProperties((prev) => prev.filter((property) => property._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete property");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  /* ============================================================
     FILTERED PROPERTIES
  ============================================================ */

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        property.title?.toLowerCase().includes(searchText) ||
        property.city?.toLowerCase().includes(searchText) ||
        property.address?.toLowerCase().includes(searchText);

      const matchesFilter = filter === "all" || property.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [properties, search, filter]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header skeleton */}
          <div className="mb-8 h-36 animate-pulse rounded-3xl bg-slate-200" />

          {/* Search skeleton */}
          <div className="mb-8 h-20 animate-pulse rounded-2xl bg-slate-200" />

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-52 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
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
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-950/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Property Management
              </div>

              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                My Properties
              </h1>

              <p className="mt-2 max-w-xl text-sm text-blue-100/80 sm:text-base">
                Manage your rental properties, tenants, availability, and
                listings from one place.
              </p>
            </div>

            <button
              onClick={() => navigate("/landlord/add-property")}
              className="group inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <span className="mr-2 text-lg">+</span>
              Add Property
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>

        {/* =====================================================
            SEARCH + FILTER
        ====================================================== */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter("available")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filter === "available"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Available
              </button>

              <button
                onClick={() => setFilter("rented")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filter === "rented"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Rented
              </button>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredProperties.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {properties.length}
              </span>{" "}
              properties
            </p>

            {(search || filter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredProperties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
              🏠
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {properties.length === 0
                ? "No properties yet"
                : "No properties found"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {properties.length === 0
                ? "Add your first rental property and start managing your listings."
                : "Try changing your search or filter to find what you're looking for."}
            </p>

            {properties.length === 0 && (
              <button
                onClick={() => navigate("/landlord/add-property")}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                + Add Your First Property
              </button>
            )}
          </div>
        ) : (
          /* =====================================================
             PROPERTY GRID
          ====================================================== */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => (
              <div
                key={property._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                {/* =================================================
                    IMAGE
                ================================================== */}

                <div className="relative h-56 overflow-hidden bg-slate-200">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-5xl">
                      🏠
                    </div>
                  )}

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Status */}
                  <div className="absolute left-4 top-4">
                    {property.status === "available" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Rented
                      </span>
                    )}
                  </div>

                  {/* Rent */}
                  <div className="absolute bottom-4 left-4">
                    <p className="text-2xl font-bold text-white drop-shadow-lg">
                      {formatCurrency(property.rent)}
                    </p>

                    <p className="text-xs text-white/70">per month</p>
                  </div>

                  {/* Quick edit */}
                  <button
                    onClick={() =>
                      navigate(`/landlord/property/edit/${property._id}`)
                    }
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-sm shadow-lg backdrop-blur transition hover:bg-white"
                    title="Edit property"
                  >
                    ✏️
                  </button>
                </div>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="p-5">
                  {/* Title */}
                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {property.title}
                  </h2>

                  {/* Location */}
                  <div className="mt-2 flex items-start gap-2">
                    <span className="mt-0.5 text-sm">📍</span>

                    <div className="min-w-0">
                      <p className="truncate text-sm text-slate-500">
                        {property.address || "Address not available"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {property.city}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-slate-100" />

                  {/* Property info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Status</p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          property.status === "available"
                            ? "text-emerald-600"
                            : "text-indigo-600"
                        }`}
                      >
                        {property.status === "available"
                          ? "Available"
                          : "Rented"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Monthly Rent</p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                        {formatCurrency(property.rent)}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================== */}

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {/* View */}
                    <button
                      onClick={() =>
                        navigate(`/landlord/property/${property._id}`)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      View
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() =>
                        navigate(`/landlord/property/edit/${property._id}`)
                      }
                      className="rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-yellow-50 hover:text-yellow-700"
                    >
                      Edit
                    </button>

                    {/* Assign Tenant */}
                    {property.status === "available" ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/landlord/property/${property._id}/assign-tenant`,
                          )
                        }
                        className="col-span-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
                      >
                        Assign Tenant →
                      </button>
                    ) : (
                      <div className="col-span-2 flex items-center justify-center rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
                        ✓ Currently Rented
                      </div>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="col-span-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete Property
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
