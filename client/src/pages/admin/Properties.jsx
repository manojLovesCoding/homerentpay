
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

  const availableCount = properties.filter(
    (p) => p.status === "available",
  ).length;

  const rentedCount = properties.filter(
    (p) => p.status !== "available",
  ).length;

  const averageRent = properties.length
    ? Math.round(
        properties.reduce((sum, p) => sum + Number(p.rent || 0), 0) /
          properties.length,
      )
    : 0;

  const getStatusStyle = (status) =>
    status === "available"
      ? "bg-[#EAF2E9] text-[#3F7050]"
      : "bg-[#F8F0E3] text-[#A47735]";

  const Avatar = ({ name, fallback, tenant = false }) => (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
        tenant
          ? "bg-[#EAF2E9] text-[#527C61]"
          : "bg-[#E8EEE8] text-[#244B3C]"
      }`}
    >
      {name?.charAt(0)?.toUpperCase() || fallback}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-4 lg:p-5">
        <div className="max-w-7xl mx-auto space-y-4 animate-pulse">
          <div>
            <div className="h-6 w-40 bg-[#E6E3D9] rounded-md" />
            <div className="h-3 w-64 bg-[#E6E3D9] rounded mt-2" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 bg-white border border-[#E6E3D9] rounded-xl"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-[#E6E3D9] rounded-xl overflow-hidden"
              >
                <div className="h-32 bg-[#E6E3D9]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-[#E6E3D9] rounded" />
                  <div className="h-3 w-1/2 bg-[#E6E3D9] rounded" />
                  <div className="h-8 bg-[#E6E3D9] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-4 lg:p-5">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <div className="bg-[#244B3C] rounded-xl px-4 py-4 sm:px-5 sm:py-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[#C6D8C8] text-xs font-medium mb-1">
                <span>⌂</span>
                <span>Property Management</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Properties
              </h1>

              <p className="text-xs sm:text-sm text-[#D6E2D7] mt-1">
                Manage and monitor rental properties.
              </p>
            </div>

            <div className="shrink-0 bg-white/10 border border-white/15 rounded-lg px-3 py-2.5 text-right">
              <p className="text-[10px] sm:text-xs text-[#D6E2D7]">
                Total Properties
              </p>
              <p className="text-xl font-bold text-white">
                {properties.length}
              </p>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-[#68756A]">Total Properties</p>
            <p className="text-xl font-bold text-[#244B3C] mt-1">
              {properties.length}
            </p>
          </div>

          <div className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-[#68756A]">Available</p>
            <p className="text-xl font-bold text-[#527C61] mt-1">
              {availableCount}
            </p>
          </div>

          <div className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-[#68756A]">Rented</p>
            <p className="text-xl font-bold text-[#B18442] mt-1">
              {rentedCount}
            </p>
          </div>

          <div className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-[#68756A]">Average Rent</p>
            <p className="text-xl font-bold text-[#244B3C] mt-1">
              ₹{averageRent.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {properties.length === 0 ? (
          <div className="bg-white border border-[#E6E3D9] rounded-xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-xl bg-[#EAF0E8] flex items-center justify-center text-3xl">
              🏠
            </div>

            <h2 className="text-lg font-bold text-[#242B26] mt-3">
              No properties found
            </h2>

            <p className="text-sm text-[#68756A] mt-1">
              There are currently no properties available in the system.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE / TABLET CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:hidden gap-3">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-xl border border-[#E6E3D9] overflow-hidden shadow-sm"
                >
                  {/* PROPERTY IMAGE */}
                  <div className="relative h-36 bg-[#EAF0E8] overflow-hidden">
                    {property.image ? (
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🏠
                      </div>
                    )}

                    <span
                      className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(
                        property.status,
                      )}`}
                    >
                      {property.status || "Unknown"}
                    </span>
                  </div>

                  {/* PROPERTY DETAILS */}
                  <div className="p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-[#242B26] truncate">
                          {property.title}
                        </h2>

                        <p className="text-xs text-[#68756A] mt-1 truncate">
                          📍 {property.city}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-base font-bold text-[#244B3C]">
                          ₹{Number(property.rent || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] text-[#8A958B]">
                          / month
                        </p>
                      </div>
                    </div>

                    {/* LANDLORD */}
                    <div className="mt-3 p-2.5 rounded-lg bg-[#F7F8F5]">
                      <p className="text-[10px] text-[#8A958B] uppercase tracking-wide">
                        Landlord
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <Avatar
                          name={property.landlord?.name}
                          fallback="L"
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#3C493F] truncate">
                            {property.landlord?.name || "N/A"}
                          </p>
                          <p className="text-[10px] text-[#8A958B] truncate">
                            {property.landlord?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* TENANT */}
                    <div className="mt-2 p-2.5 rounded-lg bg-[#F7F8F5]">
                      <p className="text-[10px] text-[#8A958B] uppercase tracking-wide">
                        Tenant
                      </p>

                      {property.tenant ? (
                        <div className="flex items-center gap-2 mt-1.5">
                          <Avatar
                            name={property.tenant.name}
                            fallback="T"
                            tenant
                          />

                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#3C493F] truncate">
                              {property.tenant.name}
                            </p>
                            <p className="text-[10px] text-[#8A958B] truncate">
                              {property.tenant.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#8A958B] mt-1.5">
                          No tenant assigned
                        </p>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        className="flex-1 py-2 rounded-lg bg-[#EAF0E8] text-[#244B3C] font-semibold text-xs hover:bg-[#DCE8DC] transition"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(property._id)}
                        className="px-4 py-2 rounded-lg bg-[#FCEEEE] text-[#B94C4C] font-semibold text-xs hover:bg-[#F8DDDD] transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden xl:block bg-white border border-[#E6E3D9] rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EAE9E2] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#242B26]">
                    Property Directory
                  </h2>
                  <p className="text-xs text-[#68756A] mt-0.5">
                    All registered rental properties
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#EAF0E8] text-[#244B3C] text-xs font-semibold">
                  {properties.length} Properties
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F7F8F5] border-b border-[#E6E3D9]">
                      {[
                        "Property",
                        "Landlord",
                        "Tenant",
                        "Rent",
                        "Status",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`px-4 py-3 text-[10px] font-semibold text-[#68756A] uppercase tracking-wider ${
                            heading === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0EFE9]">
                    {properties.map((property) => (
                      <tr
                        key={property._id}
                        className="hover:bg-[#F8FAF6] transition"
                      >
                        {/* PROPERTY */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#EAF0E8] shrink-0">
                              {property.image ? (
                                <img
                                  src={property.image}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl">
                                  🏠
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#303B32] truncate max-w-[180px]">
                                {property.title}
                              </p>
                              <p className="text-[11px] text-[#68756A] mt-1">
                                📍 {property.city}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* LANDLORD */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar
                              name={property.landlord?.name}
                              fallback="L"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-[#3C493F]">
                                {property.landlord?.name || "N/A"}
                              </p>
                              <p className="text-[10px] text-[#8A958B] truncate max-w-[150px]">
                                {property.landlord?.email || ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* TENANT */}
                        <td className="px-4 py-3">
                          {property.tenant ? (
                            <div className="flex items-center gap-2">
                              <Avatar
                                name={property.tenant.name}
                                fallback="T"
                                tenant
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-[#3C493F]">
                                  {property.tenant.name}
                                </p>
                                <p className="text-[10px] text-[#8A958B] truncate max-w-[150px]">
                                  {property.tenant.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 rounded-full bg-[#F1F2EF] text-[#7A857B] text-[10px] font-medium">
                              Not Assigned
                            </span>
                          )}
                        </td>

                        {/* RENT */}
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-[#244B3C]">
                            ₹{Number(property.rent || 0).toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] text-[#8A958B]">
                            Monthly
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(
                              property.status,
                            )}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {property.status || "Unknown"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-lg bg-[#EAF0E8] text-[#244B3C] text-xs font-semibold hover:bg-[#DCE8DC] transition"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(property._id)}
                              className="px-3 py-1.5 rounded-lg bg-[#FCEEEE] text-[#B94C4C] text-xs font-semibold hover:bg-[#F8DDDD] transition"
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
