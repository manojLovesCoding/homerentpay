import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
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
    try {
      await api.delete(`/property/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-4 mb-4">
          <h1 className="text-xl font-bold text-blue-600">
            Property List
          </h1>

          <button
            onClick={() => navigate("/landlord/add-property")}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
          >
            + Add
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >

              {/* IMAGE (smaller) */}
              {property.image && (
                <img
  src={property.image}
  alt="property"
  className="w-full h-28 object-cover"
/>
              )}

              {/* CONTENT */}
              <div className="p-3">

                <h2 className="text-sm font-semibold text-gray-800 truncate">
                  {property.title}
                </h2>

                <p className="text-xs text-gray-500">
                  {property.city}
                </p>

                <p className="text-sm font-bold text-blue-600 mt-1">
                  ₹{property.rent}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-3">

                  <button className="text-xs px-2 py-1 bg-gray-100 rounded">
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/property/edit/${property._id}`)
                    }
                    className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(property._id)}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default PropertyList;