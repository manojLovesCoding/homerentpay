import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Home,
  CheckCircle2,
  Building2,
  X,
  Users,
} from "lucide-react";

const PropertyList = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get("/property");
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Delete property
  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="w-full">
          <p className="text-sm font-semibold text-[#242B26]">
            Delete this property?
          </p>

          <p className="mt-1 text-xs text-[#68756A]">
            This action cannot be undone.
          </p>

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-lg border border-[#E6E3D9] px-3 py-1.5 text-xs font-semibold text-[#526056] hover:bg-[#F1F3EF]"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setDeletingId(id);

                try {
                  await api.delete(`/property/${id}`);

                  setProperties((prev) =>
                    prev.filter((property) => property._id !== id),
                  );

                  toast.success("Property deleted successfully!");
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Failed to delete property",
                  );
                } finally {
                  setDeletingId(null);
                }
              }}
              className="rounded-lg bg-[#B45D50] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#98483E]"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: {
          background: "#FFFFFF",
          color: "#242B26",
          border: "1px solid #E6E3D9",
          borderRadius: "12px",
          padding: "14px",
          maxWidth: "340px",
        },
      },
    );
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

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

  const availableCount = properties.filter(
    (property) => property.status === "available",
  ).length;

  const rentedCount = properties.filter(
    (property) => property.status === "rented",
  ).length;

  const buttonBase =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition";

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-5">
        <div className="mx-auto max-w-7xl animate-pulse space-y-4">
          <div className="h-24 rounded-2xl bg-[#E8EDE7]" />
          <div className="h-16 rounded-xl bg-white" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="overflow-hidden rounded-xl bg-white">
                <div className="h-36 bg-[#E8EDE7]" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-[#E8EDE7]" />
                  <div className="h-3 w-1/2 rounded bg-[#E8EDE7]" />
                  <div className="h-8 rounded bg-[#E8EDE7]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-5">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-[#244B3C] px-5 py-4 shadow-sm sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-medium text-[#D6A45D]">
              <Building2 size={14} />
              PROPERTY MANAGEMENT
            </div>

            <h1 className="text-xl font-bold text-white sm:text-2xl">
              My Properties
            </h1>

            <p className="mt-1 text-xs text-[#E0E9E1]">
              Manage your rental properties and tenant assignments.
            </p>
          </div>

          <button
            onClick={() => navigate("/landlord/add-property")}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#D6A45D] px-4 py-2.5 text-sm font-semibold text-[#244B3C] transition hover:bg-[#E4B875] sm:self-center"
          >
            <Plus size={17} />
            Add Property
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-xl border border-[#E6E3D9] bg-white p-3">
            <div className="flex items-center gap-2 text-[#527C61]">
              <Building2 size={16} />
              <span className="text-[11px] font-medium">Total</span>
            </div>

            <p className="mt-1 text-xl font-bold text-[#242B26]">
              {properties.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#E6E3D9] bg-white p-3">
            <div className="flex items-center gap-2 text-[#527C61]">
              <CheckCircle2 size={16} />
              <span className="text-[11px] font-medium">Available</span>
            </div>

            <p className="mt-1 text-xl font-bold text-[#527C61]">
              {availableCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#E6E3D9] bg-white p-3">
            <div className="flex items-center gap-2 text-[#A47A3F]">
              <Users size={16} />
              <span className="text-[11px] font-medium">Rented</span>
            </div>

            <p className="mt-1 text-xl font-bold text-[#A47A3F]">
              {rentedCount}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="rounded-xl border border-[#E6E3D9] bg-white p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A968C]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..."
                className="w-full rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] py-2 pl-9 pr-9 text-sm text-[#242B26] outline-none transition placeholder:text-[#9AA39A] focus:border-[#527C61] focus:bg-white"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A968C] hover:text-[#244B3C]"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Available", value: "available" },
                { label: "Rented", value: "rented" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    filter === item.value
                      ? "bg-[#244B3C] text-white"
                      : "bg-[#F1F3EF] text-[#68756A] hover:bg-[#E8EDE7]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#F0EEE7] pt-2.5">
            <p className="text-xs text-[#68756A]">
              Showing{" "}
              <span className="font-bold text-[#242B26]">
                {filteredProperties.length}
              </span>{" "}
              of {properties.length} properties
            </p>

            {(search || filter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="text-xs font-semibold text-[#527C61] hover:text-[#244B3C]"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filteredProperties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#C9D4C8] bg-white px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0E9] text-[#527C61]">
              <Home size={24} />
            </div>

            <h2 className="mt-3 text-base font-bold text-[#242B26]">
              {properties.length === 0
                ? "No properties yet"
                : "No properties found"}
            </h2>

            <p className="mt-1 text-xs text-[#68756A]">
              {properties.length === 0
                ? "Add your first rental property to get started."
                : "Try changing your search or filter."}
            </p>

            {properties.length === 0 && (
              <button
                onClick={() => navigate("/landlord/add-property")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#244B3C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#193A2E]"
              >
                <Plus size={16} />
                Add Your First Property
              </button>
            )}
          </div>
        ) : (
          /* Property cards */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => (
              <div
                key={property._id}
                className="group overflow-hidden rounded-xl border border-[#E6E3D9] bg-white transition hover:border-[#A8BDA5] hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden bg-[#E8EDE7]">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#A8BDA5]">
                      <Home size={42} strokeWidth={1.3} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      property.status === "available"
                        ? "bg-[#E7F0E7] text-[#386747]"
                        : "bg-[#F5EBD9] text-[#8B642F]"
                    }`}
                  >
                    {property.status === "available" ? "Available" : "Rented"}
                  </span>

                  <div className="absolute bottom-3 left-3">
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(property.rent)}
                    </p>

                    <p className="text-[10px] text-white/80">Per month</p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/landlord/property/edit/${property._id}`)
                    }
                    title="Edit property"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-[#244B3C] shadow-sm transition hover:bg-white"
                  >
                    <Pencil size={14} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3.5">
                  <h2 className="truncate text-sm font-bold text-[#242B26]">
                    {property.title}
                  </h2>

                  <div className="mt-1.5 flex items-center gap-1.5 text-[#68756A]">
                    <MapPin size={13} className="shrink-0 text-[#527C61]" />

                    <p className="truncate text-xs">
                      {property.address || "Address not available"}
                    </p>
                  </div>

                  <p className="ml-5 mt-0.5 truncate text-[11px] text-[#929B91]">
                    {property.city}
                  </p>

                  <div className="my-3 grid grid-cols-2 gap-2 border-y border-[#F0EEE7] py-2.5">
                    <div>
                      <p className="text-[10px] text-[#929B91]">Status</p>

                      <p
                        className={`mt-0.5 text-xs font-semibold ${
                          property.status === "available"
                            ? "text-[#527C61]"
                            : "text-[#A47A3F]"
                        }`}
                      >
                        {property.status === "available"
                          ? "Available"
                          : "Rented"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-[#929B91]">Monthly Rent</p>

                      <p className="mt-0.5 truncate text-xs font-semibold text-[#242B26]">
                        {formatCurrency(property.rent)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        navigate(`/landlord/property/${property._id}`)
                      }
                      className={`${buttonBase} border border-[#DCE4DB] text-[#527C61] hover:bg-[#F1F5F0]`}
                    >
                      <Eye size={14} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/landlord/property/edit/${property._id}`)
                      }
                      className={`${buttonBase} bg-[#F1F3EF] text-[#526056] hover:bg-[#E6EAE3]`}
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    {property.status === "available" ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/landlord/property/${property._id}/assign-tenant`,
                          )
                        }
                        className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#244B3C] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#193A2E]"
                      >
                        <Users size={14} />
                        Assign Tenant
                      </button>
                    ) : (
                      <div className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-[#EAF0E9] px-3 py-2 text-xs font-semibold text-[#527C61]">
                        <CheckCircle2 size={14} />
                        Currently Rented
                      </div>
                    )}

                    <button
                      onClick={() => handleDelete(property._id)}
                      disabled={deletingId === property._id}
                      className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#F0DDDA] bg-[#FCF6F4] px-3 py-2 text-xs font-semibold text-[#B45D50] transition hover:bg-[#F9EAE7] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      {deletingId === property._id
                        ? "Deleting..."
                        : "Delete Property"}
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
