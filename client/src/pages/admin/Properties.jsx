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

      setProperties((prev) =>
        prev.filter((item) => item._id !== id),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete property");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Properties
      </h1>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border">
        <table className="w-full text-left">

          {/* Head */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">City</th>
              <th className="p-4">Landlord</th>
              <th className="p-4">Tenant</th>
              <th className="p-4">Rent</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {properties.length > 0 ? (
              properties.map((property) => (
                <tr
                  key={property._id}
                  className="border-t hover:bg-gray-50"
                >

                  {/* Title */}
                  <td className="p-4 font-medium text-gray-800">
                    {property.title}
                  </td>

                  {/* City */}
                  <td className="p-4 text-gray-600">
                    {property.city}
                  </td>

                  {/* Landlord */}
                  <td className="p-4 text-gray-600">
                    <div>
                      <p className="font-medium">
                        {property.landlord?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {property.landlord?.email || ""}
                      </p>
                    </div>
                  </td>

                  {/* Tenant */}
                  <td className="p-4 text-gray-600">
                    {property.tenant ? (
                      <div>
                        <p className="font-medium">
                          {property.tenant.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {property.tenant.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  {/* Rent */}
                  <td className="p-4 font-semibold text-gray-800">
                    ₹{property.rent}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        property.status === "available"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 space-x-2">
                    <button
                      className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(property._id)}
                      className="px-3 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-500"
                >
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Properties;